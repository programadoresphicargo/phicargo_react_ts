import { MRT_ColumnDef } from "material-react-table";

export const exportToCSV = <T extends Record<string, unknown>>(
    data: T[],
    columns: MRT_ColumnDef<T>[],
    filename: string = "data.csv"
): void => {

    const csvRows: string[] = [];

    const validColumns = columns.filter(
        (column) => column.accessorKey
    );

    const headers = validColumns.map(
        (column) => String(column.header)
    );

    csvRows.push(headers.join(","));
    data.forEach((row) => {
        const values = validColumns.map((column) => {
            const accessorKey = column.accessorKey as keyof T;
            const value = row[accessorKey] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob(
        [csvString],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};