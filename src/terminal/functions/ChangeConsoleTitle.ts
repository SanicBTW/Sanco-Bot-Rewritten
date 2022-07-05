import {Logger} from '../../NewLogger';
import { ConfigHelper } from '../../ConfigHandler';

module.exports = {
    alias: "change-title",
    exec: function(){
        var OptVal = new ConfigHelper().getValue("terminal title");
        if(OptVal != null) process.title = OptVal;
        else Logger("The option value is null, the title didn't change", "ERROR");
    }
}