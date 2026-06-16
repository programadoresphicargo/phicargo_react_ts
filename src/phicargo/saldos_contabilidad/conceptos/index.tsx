import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from "../pages";
import PaymentConceptsForm from './form';
import { Button } from '@heroui/react';

export type PaymentConcept = {
  id: number;
  name: string;
}

const ConceptosTable = () => {

  const [conceptId, setConceptId] = React.useState<number | null>(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id: number | null) => {
    setConceptId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState<PaymentConcept[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get<PaymentConcept[]>(`/payment_concepts/`);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<PaymentConcept>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Concepto',
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    groupedColumnMode: "remove",
    state: { showProgressBars: isLoading },
    positionToolbarAlertBanner: "bottom",
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 100 },
      showColumnFilters: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          handleClickOpen(row.original.id);
        }
      },
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.getCanExpand() ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.getCanExpand() ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <h1
              className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
            >
              Conceptos
            </h1>
            <Button color='primary' onPress={() => handleClickOpen(null)}>Nuevo</Button>
          </div>
        </div>
      </Box>
    ),
  });

  return (
    <>
      <PaymentConceptsForm open={open} handleClose={handleClose} conceptId={conceptId}></PaymentConceptsForm>
      <CustomNavbar pages={pages}></CustomNavbar>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ConceptosTable;
