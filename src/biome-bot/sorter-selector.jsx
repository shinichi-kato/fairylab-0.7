import React ,{useState} from 'react';
import Button from '@material-ui/core/Button';
import  Menu  from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



export default function SorterSelector(props){
  const {sorters,sorterLabel} = props;
  const [anchorEl,setAnchorEl] = useState(null);
  
  function handleClick(e){
    setAnchorEl(e.currentTarget);
  }

  function handleClickMenuItem(e,index){
    props.handleChangeSortBy(sorters[index]);
    setAnchorEl(null);
  }

  function handleClose(){
    setAnchorEl(null);
  }

	return (
    <>
      <Button
        aria-controls="sorter-selector" 
        aria-haspopup="true"
        onClick={handleClick}
      >
        {sorterLabel[props.sortBy]}<ExpandMoreIcon />
      </Button>
      <Menu	
        id="sorter-selector"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {sorters.map((sorter,index)=>(
          <MenuItem 
            key={sorter}
            selected={sorter===props.sortBy}
            onClick={e=>handleClickMenuItem(e,index)}
          >
            {sorterLabel[sorter]}
          </MenuItem>
        ))}
      </Menu>
    </>
	)
}