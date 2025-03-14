export const exportToCSV = (data, columns, filename = "data.csv") => {
    if (!data || !columns) return;

    const csvRows = [];
    const headers = columns.map(column => column.header);
    csvRows.push(headers.join(',')); // Agregar encabezados

    data.forEach(row => {
        const values = columns.map(column => {
            const value = row[column.accessorKey] ?? ''; // Evitar valores `undefined`
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};
