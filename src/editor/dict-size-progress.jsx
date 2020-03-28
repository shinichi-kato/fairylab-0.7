import React ,{useState} from 'react';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';

const fireStoreByteMaxSize = 1048487;
const sizeDisplayFactor = 100 / Math.sqrt(fireStoreByteMaxSize);

function dictSizeScale(size){
  /*
    辞書のサイズを0-100でprogressバーに表示するための換算。
    サイズはsqrtスケールとし、fireStoreのバイト型が
    最大 1,048,487 バイト（1 MiB～89 バイト）
    であるため、これが100となるように換算する。
    つまり    
    value={Math.sqrt(size)/Math.sqrt(fireStoreByteMaxSize)*100
    となる
  */
    return Math.sqrt(size)*sizeDisplayFactor;
}

const DictSizeProgressComponent = withStyles({
  root: {
    height: 14,
    backgroundColor: '#999999',
    borderRadius: 6,
  },
  bar: {
    backgroundColor: '#2e7d32',
    borderRadius: 6,
  }
})(LinearProgress);

const ParameterTooltip = withStyles({
  tooltip:{
    fontSize: 14,
  }
})(Tooltip);

export default function DictSizeProgress(props){
  return (
    <ParameterTooltip 
    title={`${props.size.toFixed(2)} バイト`} 
    arrow>
      <DictSizeProgressComponent
        variant="determinate"
        value={dictSizeScale(props.size)}
      />
    </ParameterTooltip>
  )
}