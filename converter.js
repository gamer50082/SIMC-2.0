const xlsx = require('xlsx');
const fs = require('fs');

function convertExcelToJson(excelFile, jsonFile) {
    // Read the Excel file
    const workbook = xlsx.readFile(excelFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert the sheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    // Initialize the list to store timetable entries
    const timetable = [];

    // Iterate over each row in the data
    data.forEach(row => {
        // Split the classes string into a list
        const classesList = row.classes.split(',').map(cls => cls.trim());

        // Create a dictionary for the current entry
        const entry = {
            weektype: row.weektype,
            day: row.day.toLowerCase(),  // Ensure day is in lowercase
            timeframe: {
                start: row.start,
                end: row.end
            },
            classes: classesList
        };

        // Add the entry to the timetable list
        timetable.push(entry);
    });

    // Create the final JSON structure
    const timetableJson = { timetable: timetable };

    // Write the JSON data to the output file
    fs.writeFileSync(jsonFile, JSON.stringify(timetableJson, null, 4), 'utf8');
    console.log("File Converted")
}

// Convert the Excel file to JSON
convertExcelToJson('timetable.xlsx', 'timetable.json');
