//for the .optf (option file) file extension
//todo, if trying to read a new option file, add it instead of re doing the whole setup
import fs from 'fs';
import { Logger } from './NewLogger';

export var configuration:[{
    optName: string, 
    optState: string
}];

var finishedSettingUp:boolean = false;
var isComment:boolean = false;

export async function setupOptionFile(path:string)
{
    configuration = [{optName: "null", optState: "null"}]
    var daList:Array<string> = [];
    if(path.endsWith(".optf"))
    {
        daList = fs.readFileSync(path, 'utf-8').trim().split('\n');
        for(var i in daList)
        {
            if(daList[i].startsWith("#"))
            {
                /* debug stuff
                Logger("Detected comment","DEBUG");
                var idxcmnt:any = i;
                Logger("Comment Index " + idxcmnt, "DEBUG")
                Logger(daList[idxcmnt], "DEBUG");*/
                isComment = true;
            }
            var options = daList[i].split(":");
            if(isComment == false)
            {
                configuration.push({optName: options[0], optState: options[1]});
                configuration[i].optName = options[0];
                configuration[i].optState = options[1];
                //the last item is repeated for some reason
                configuration.at(-1)!.optName = "null";
                configuration.at(-1)!.optState = "null";
            }

            finishedSettingUp = true;
        }
    }
    else
    {
        path += ".optf";
        await setupOptionFile(path);
    }
}

export function getOptionField(index:number):string
{
    var daValue:string = "";
    if(finishedSettingUp == true)
    {
        daValue = configuration[index].optState;
    }
    else
    {
        Logger("didnt finish", "DEBUG")
        daValue = "null";
    }
    return daValue;
}