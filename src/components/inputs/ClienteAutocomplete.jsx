import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, CardHeader, Progress, Textarea } from '@heroui/react';
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { useAsyncList } from "@react-stately/data";

export default function SelectCliente({ key_name, label, setValue, value, isEditing = true, variant = "flat", placeholder, isDisabled = false }) {

 let list = useAsyncList({
  async load({ signal, filterText }) {
   let res = await odooApi.get(`/contacts/search-by-name/${filterText}`, { signal });

   return {
    items: res.data,
   };
  },
 });

 const [selectedKey, setSelectedKey] = useState(0);
 const [data, setData] = useState([]);
 const [isLoading, setLoading] = useState(false);

 const handleSelection = (key) => {
  const item = list.items.find((i) => i.id == key);
  if (item) {
   setValue(key_name, Number(key))
   setSelectedKey(key);
   list.setFilterText(item.name);
  }
 };

 return (
  <React.Fragment>
   <Autocomplete
    key={selectedKey ?? 'empty'}
    selectedKey={selectedKey}
    fullWidth
    variant={variant}
    placeholder={placeholder}
    label={label}
    onSelectionChange={handleSelection}
    errorMessage="Campo obligatorio"
    isDisabled={isDisabled}
    inputValue={list.filterText}
    isLoading={list.isLoading}
    items={list.items}
    onInputChange={list.setFilterText}
   >
    {(item) => (
     <AutocompleteItem key={String(item.id)}>
      <div className="flex flex-col">
       <span>{item.name}</span>
      </div>
     </AutocompleteItem>
    )}
   </Autocomplete>
  </React.Fragment>
 );
}