import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { getComparator, stableSort, Order } from '../../../utils/utils'
import { HeadCell } from '../../../interfaces/interfaces'
import uuid from 'react-uuid'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectShiftById } from '@/features/shift/shiftApiSlice'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function SortedTable<
  T extends { [key in keyof T]: string | number | string[] | number[] }
>({
  ids,
  entities,
  headCells,
  isCheckable,
  isSortable,
  disable,
  handleRowClick,
  handleButtonClick,
}: {
  ids: EntityId[]
  entities: Dictionary<T>
  headCells: HeadCell<T>[]
  isCheckable: boolean
  isSortable: boolean
  disable?: boolean
  handleRowClick?: (event: React.MouseEvent<unknown>, id: EntityId) => void
  handleButtonClick?: (event: React.MouseEvent<unknown>, id: EntityId) => void
}) {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof T>(headCells[0].id)
  const [selected, setSelected] = React.useState<readonly string[]>([])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    if (isCheckable) {
      const selectedIndex = selected.indexOf(id)
      let newSelected: readonly string[] = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        )
      }

      setSelected(newSelected)
    }
    handleRowClick ? handleRowClick(event, id) : null
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const head = (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={uuid()}
            align={headCell.align}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isSortable && isSortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </StyledTableCell>
        ))}
        {isCheckable ? (
          <StyledTableCell padding="checkbox"></StyledTableCell>
        ) : null}
      </TableRow>
    </TableHead>
  )

  let entityIds: EntityId[] = []
  if (isSortable) {
    entityIds = stableSort(ids, entities, getComparator(order, orderBy))
  } else {
    entityIds = ids
  }

  const body = entityIds?.map((entityId, index) => {
    const id: string = entityId as string
    const isItemSelected = isSelected(id)
    const labelId = `enhanced-table-checkbox-${index}`

    const row = entities[id]
    if (!row) {
      return null
    }
    return (
      <StyledTableRow
        hover
        onClick={(event) => handleClick(event, id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={id}
        selected={isItemSelected}
      >
        {headCells.map((cell, i) => {
          if (i == 0) {
            return (
              <StyledTableCell
                key={uuid()}
                component="th"
                id={labelId}
                scope="row"
                align={cell.align}
                sx={disable ? { backgroundColor: 'gray' } : {}}
              >
                {cell.transformFn ? cell.transformFn(row) : row[cell.id]}
              </StyledTableCell>
            )
          } else {
            return (
              <StyledTableCell
                key={uuid()}
                align={cell.align}
                sx={disable ? { backgroundColor: 'gray' } : {}}
              >
                {cell.isButton && cell.button
                  ? cell.button({ handleButtonClick, id })
                  : cell.transformFn
                  ? cell.transformFn(row)
                  : row[cell.id]}
              </StyledTableCell>
            )
          }
        })}

        {isCheckable ? (
          <StyledTableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={isItemSelected}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </StyledTableCell>
        ) : null}
      </StyledTableRow>
    )
  })

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            {head}
            <TableBody>{body}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
