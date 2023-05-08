- The publish schedule featrue will take the the weekly tentative schedule and duplicate it for a period of time given by the user.

[] Button: this will open a Dialog window that will prompt the user to select the period for the schedule

[] Dialog: this will have a form inbedded to fill in the date range of the schedule and the name of the schedule

[] Form: this form will take in the start date, end date and name of the schedule. It then will will create a list of scheduleShifts filled out with the schdeule properties filled out, then save all the documents in a colletion as a batch.

\*\* Question: # If a manager has already created a schedule then if he attempts to create a new one, what should the program do? - overwrite the existing schedule - dont allow the mangaer to create the schedule - should we have the avility of editing the current schedule instead? - maybe if the schedule is already published then, the manager can select a user or multiple users and have the avility of editing that user or users schedule.

\*\*\* Thigns to fix:
only allow date ranges that start the next day or later
the endDate must be greater then the startDate
published scheduleNames must be unique and are case insensitive
