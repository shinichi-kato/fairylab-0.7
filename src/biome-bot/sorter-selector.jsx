import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';


export default function SorterSelector(props){
  const {sorters,sorterIndex,sorterSettings} = props;
  
  function handleClickButton(index){
    props.handleChangeSorterIndex(index);
  }

	return (
    <ButtonGroup aria-label="sorter-selector">
      {sorters.map((sorter,index)=>(
        <Button 
          key={index}
          color={index===sorterIndex ? "primary" : "default"}
          variant={index===sorterIndex ? "contained": "default"}
          onClick={e=>handleClickButton(index)}    
        >
          {sorterSettings[sorter].label}
        </Button>        
      ))}

    </ButtonGroup>
	)
}