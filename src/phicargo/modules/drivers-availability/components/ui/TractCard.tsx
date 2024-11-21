import { Card, CardContent, ListSubheader } from '@mui/material';

import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

interface Props {
  title: string;
}

const TractCard = ({title}: Props) => {
  return (
    <Card>
      <CardContent>
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {title}
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="C-0059" 
              secondary={
                <>
                  <span>Operador: </span>
                  <span style={{ color: 'blue' }}>...</span>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="C-0059" 
              secondary={
                <>
                  <span>Operador: </span>
                  <span style={{ color: 'blue' }}>...</span>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="C-0059" 
              secondary={
                <>
                  <span>Operador: </span>
                  <span style={{ color: 'blue' }}>...</span>
                </>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default TractCard;
