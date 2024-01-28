export const getMontshToUpdate = () => {
    const actualDate = new Date();
    const monthsToUpdate = new Array(actualDate.getMonth() + 1).fill('a');
    return monthsToUpdate.map((_, index) => {
        // console.log(index);
        const startDate = new Date();
        startDate.setMonth(index, 1);

        let endDate: Date;
        const actualDate = new Date(Date.now());
        if (actualDate.getMonth() !== index) {
            console.log('here');
            endDate = new Date();
            endDate.setMonth(index + 1, 0);
        } else {
            endDate = actualDate;
        }

        return {
            startTimestamp: startDate.getTime(),
            endTimestamp: endDate.getTime(),
        };
    });
};
