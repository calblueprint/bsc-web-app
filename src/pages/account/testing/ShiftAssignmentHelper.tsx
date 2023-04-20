import { useGetUsersQuery } from "@/features/user/userApiSlice";
import { createListOfUsersForShift } from "@/sprintFiles/availabilityHelper";
import { useEffect } from "react";

const ShiftAssignmentHelper = () => {
    const {
        data: dataUsers,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetUsersQuery({})

    const testFunction = () => {
        let testShiftObject = {
            id: "1",
            name: "Clean the house",
            shiftID: "4iWhGXXz65H0aPfaF3RJ",
            description: "Clean house pls ggreg sucks", 
            possibleDays: ["Monday", "Tuesday", "Wednesday"],
            timeWindow: {
                startTime: "1930",
                endTime: "2300"
            },
            timeWindowDisplay: "",
            assignedDay: "",
            assignedUser: "maybe populate this with user id",
            hours: 1.5,
            verificationBuffer: 1,
            verification: false,
            category: "hehe",
            preferences: {
                preferredBy: [""],
                dislikedBy: [""]
            }
        }
        
        let testDays = ["Sunday", "Monday"];
        if (dataUsers !== undefined) {
            console.log(createListOfUsersForShift(testShiftObject, dataUsers, testDays));
        }
        
        // console.log(dayjs('1900', 'HHmm').format('HHmm'))
        // const num = 1900
        // console.log(dayjs(num.toString(), 'HHmm'))        
    }

    useEffect(() => {
        testFunction();
    }, [dataUsers])
    return (
        <div>
            hello
        </div>
    )
}

export default ShiftAssignmentHelper