import React, {useContext} from 'react';
import {BotContext} from '../biome-bot/bot-provider.jsx';

export default function BotDownload(props){
    const bot = useContext(BotContext);
    bot.downloadDialog();
    return (
      <></>
    )
}