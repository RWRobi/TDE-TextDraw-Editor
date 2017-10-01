var TextDrawPosX = [];
var TextDrawPosY = [];
var TextDrawAligment = [];
var TextDrawFloatW = [];
var TextDrawFloatH = [];
var TextDrawWSize = [];
var TextDrawHSize = [];
var TextDrawType = [];
var TextDrawText = [];
var TextDrawShadow = [];
var TextDrawFont = [];
var TextDrawOutline = [];
var TextDrawR = [];
var TextDrawG = [];
var TextDrawB = [];
var TextDrawA = [];
var TextDraws = 0;
var TDEStatus = 0;
var SelectedTD = 0;
var TDEditing = 0;
var Menu = null;
var nr = 0;
var myBrowser = null;

var isOpenHelpWindow = false;
var isShowDebug = false;

var version;
var author;

API.onKeyDown.connect(function (sender, e) 
{
    if(e.KeyCode == Keys.Enter)
    {
        if (isOpenHelpWindow === true)
            isOpenHelpWindow = false;    

        else if (TDEditing > 0) {
            API.sendChatMessage("~y~TDE EDITOR:", "~w~You stopped editing this textdraw position.");
            TDEditing = 0;
            API.showCursor(false);
        }
    }
});

API.onUpdate.connect(function () 
{
    if (isOpenHelpWindow === true) {
        var res = API.getScreenResolutionMaintainRatio();
        
        API.drawRectangle((res.Width / 2) - 300, (res.Height / 2) - 260, 600, 450, 0, 0, 0, 191);
        API.drawRectangle((res.Width / 2) - 300, (res.Height / 2) - 260, 600, 50, 255, 0, 0, 109);
        
        API.drawText('HELP', (res.Width / 2) - 290, (res.Height / 2) - 258, 0.800000011920929, 255, 255, 255, 255, 1, 0, false, false, 0);
        API.drawText('/font [0-7] - set font style TextDraw', (res.Width / 2) - 290, (res.Height / 2) - 204.00003051757812, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/aligment (/tda) [0 - left, 1 - center, 2 - right] - set aligment font', (res.Width / 2) - 290, (res.Height / 2) - 178.00003051757812, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/tdfloat (/tdf) [0 - left, 1 - center, 2 - right] - analog float in CSS', (res.Width / 2) - 290, (res.Height / 2) - 153, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/tdcreate (/tdc) [1 - Text, 2 - Box] - create TextDraw', (res.Width / 2) - 290, (res.Height / 2) - 130.00003051757812, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/tdcolor (/tdcl) [rgba (0-255)] - set TextDraw color', (res.Width / 2) - 290, (res.Height / 2) - 108, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/tdmove (/tdm) - move the current textdraw', (res.Width / 2) - 290, (res.Height / 2) - 85, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/tdsize (/tds) - change width / height size of the current textdraw', (res.Width / 2) - 290, (res.Height / 2) - 61, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/tdtext (/tdt) - change text of the current textdraw', (res.Width / 2) - 290, (res.Height / 2) - 36, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/shadow (/tdsh) [0 - no, 1 - yes], /outline (/tdo) [0 - no, 1 - yes]', (res.Width / 2) - 290, (res.Height / 2) - 9, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('/tdeclose (/tdcls), /tdr(emove), /tdexp(ort), /tded(it), /tdfilename (/tdfn), /tdd(ebug)', (res.Width / 2) - 290, (res.Height / 2) + 18, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('Type ~y~/tde~w~ for open the TDE Editor', (res.Width / 2) - 290, (res.Height / 2) + 46, 0.4000000059604645, 255, 255, 255, 255, 4, 0, false, false, 0);
        API.drawText('Press ~g~Enter~w~ if u want close this window', (res.Width / 2), (res.Height / 2) + 136, 0.4000000059604645, 255, 255, 255, 255, 4, 1, false, false, 0);
    }
    
	if(Menu != null && Menu.Visible == true) API.drawMenu(Menu);
	if(TDEStatus == 1)
	{
		if(TextDraws > 0)
		{
			Move();
			
			if(isShowDebug)
				Debug();
			
			for(var i = 0; i < TextDraws; i++)
			{
				if(TextDrawType[i] == 1)
				{
					API.drawText("" + TextDrawText[i], TextDrawPosX[i], TextDrawPosY[i], TextDrawWSize[i], TextDrawR[i], TextDrawG[i], TextDrawB[i], 
					TextDrawA[i], TextDrawFont[i], TextDrawAligment[i], TextDrawShadow[i], TextDrawOutline[i], 0);
				}
				if(TextDrawType[i] == 2)
				{
					API.drawRectangle(TextDrawPosX[i], TextDrawPosY[i], TextDrawWSize[i], TextDrawHSize[i], TextDrawR[i], TextDrawG[i], TextDrawB[i], 
					TextDrawA[i]);
				}
			}
		}
	}
}); 

API.onServerEventTrigger.connect(function (eventName, args) 
{
	switch(eventName)
	{
		case "OpenHelpWindow": 
		{
            isOpenHelpWindow = true;
			break;
		}
		case "TDEDebug": 
		{
            isShowDebug = !isShowDebug;
			break;
		}
		case "SetConfig": 
		{
		    author = args[0];
		    version = args[1];
			break;
		}
		case "Show_TDE":
		{
			if(TDEStatus == 1) 
			{
				API.sendNotification("~r~TextDraw editor is already active, [/tdeclose]");
				return;
			}
			
			if(TextDraws > 0)
				for(var i = 0; i < TextDraws; i++)
					TextDrawType[i] = 0;
			
			TDEditing = 0;
			TextDraws = 0;
			TDEStatus = 1;

            API.triggerServerEvent("Help");
			API.sendNotification("~y~TextDraw Editor has opened.");
			
			var res = API.getScreenResolution();
			myBrowser = API.createCefBrowser(res.Width, res.Height);
			API.waitUntilCefBrowserInit(myBrowser);
			API.setCefBrowserPosition(myBrowser, 0,0);       
			API.loadPageCefBrowser(myBrowser, "colors.html");
			break;
		}
		case "Close_TDE":
		{
			if(TextDraws > 0)
				for(var i = 0; i < TextDraws; i++)
					TextDrawType[i] = 0;
			
			TextDraws = 0;
			TDEditing = 0;
			TDEStatus = 0;
			API.showCursor(false);
			API.sendNotification("~y~TDE EDITOR CLOSED");
			break;
		}
		case "TDRemove":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			TextDrawType[SelectedTD] = 0;
			TDEditing = 0;
			API.showCursor(false);
			
			for(var i = 0; i < TextDraws; i++)
				if(TextDrawType[SelectedTD] > 0) SelectedTD = i;
			
			break;
		}
		case "TDOutline":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			if(TextDrawType[SelectedTD] == 2)
			{
				API.sendNotification("~r~You can change text only for Text TextDraws");
				return;
			}
			TextDrawOutline[SelectedTD] = args[0];
			
			break;
		}
		case "TDShadow":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			if(TextDrawType[SelectedTD] == 2)
			{
				API.sendNotification("~r~You can change text only for Text TextDraws");
				return;
			}
			TextDrawShadow[SelectedTD] = args[0];
			break;
		}
		case "TDText":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			if(TextDrawType[SelectedTD] == 2)
			{
				API.sendNotification("~r~You can change text only for Text TextDraws");
				return;
			}
			
			TextDrawText[SelectedTD] = args[0];
			break;
		}
		case "TDFloat":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			TextDrawFloatW[SelectedTD] = args[0];
			TextDrawFloatH[SelectedTD] = args[1];
			API.sendChatMessage("~y~TDE:~s~ Float " + args[0] + " - " + args[1]);
			break;
		}
		case "TDAligment":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			if(TextDrawType[SelectedTD] == 2)
			{
				API.sendNotification("~r~You can change aligment only for Text TextDraws");
				return;
			}
			
			TextDrawAligment[SelectedTD] = args[0];
            API.sendChatMessage("~y~TDE:~s~ aligment " + args[0]);
			break;
		}
		case "TDColor":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			API.showCursor(!API.isCursorShown());
			break;
		}
		case "TDFont":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			if(TextDrawType[SelectedTD] == 2)
			{
				API.sendNotification("~r~You can change font only for Text TextDraws");
				return;
			}
			
			TextDrawFont[SelectedTD] = args[0];
			break;
		}
		case "CreateTD":
		{
			if(TDEditing > 0)
			{
				API.sendChatMessage("~y~TDE EDITOR:", "~w~You stopped editing this textdraw position.");
				TDEditing = 0;
				API.showCursor(false);
			}
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			var i = TextDraws;
			if(args[0] == 1)
			{
				TextDrawText[i] = "TDE EDITOR";
				TextDrawAligment[i] = 1;
				TextDrawPosX[i] = 650.0;
				TextDrawPosY[i] = 280.0;
				TextDrawR[i] = 255; TextDrawG[i] = 255; TextDrawB[i] = 255; TextDrawA[i] = 255;
				TextDrawFont[i] = 1;
				TextDrawShadow[i] = false;
				TextDrawOutline[i] = false;
				TextDrawWSize[i] = 1.0;
			}
			if(args[0] == 2)
			{
				TextDrawAligment[i] = "";
				TextDrawPosX[i] = 650.0;
				TextDrawPosY[i] = 280.0;
				TextDrawR[i] = 255; TextDrawG[i] = 255; TextDrawB[i] = 255; TextDrawA[i] = 255;
				TextDrawWSize[i] = 400.0;
				TextDrawHSize[i] = 400.0;
			}
			TDEditing = 0;
			SelectedTD = i;
			TextDrawType[i] = args[0];
			TextDraws++;
			break;
		}
		case "TDMove":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			if(TDEditing > 0)
			{
				API.sendChatMessage("~y~TDE EDITOR:", "~w~You stopped editing this textdraw position.");
				TDEditing = 0;
				API.showCursor(false);
				return;
			}
			
			TDEditing = 1;
			API.sendChatMessage("~y~TDE EDITOR:", "~w~You are now editing this textdraw position.");
			API.sendChatMessage("~y~TDE MOVEMENT:", "~w~To stop movement press ENTER.");
			API.sendChatMessage("~y~TDE MOVEMENT:", "~w~To start movement keep LMOUSE pressed.");
			API.showCursor(true);
			break;
		}
		case "TDSize":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			
			TextDrawWSize[SelectedTD] = args[0];
			TextDrawHSize[SelectedTD] = args[1];
			break;
		}
		case "EditTD":
		{
			if(TextDraws < 1)
			{
				API.sendNotification("There are no textdraws created.");
				return;
			}
			Menu = API.createMenu("TextDraw Editor", "Select a textdraw", 0, 0, 6);
			for(var i = 0; i < TextDraws; i++)
			{
				if(TextDrawType[i] == 1) 
				{	Menu.AddItem(API.createMenuItem("" + nr + "." + TextDrawText[i], "Select this textdraw")); nr++; }
				if(TextDrawType[i] == 2) 
				{	Menu.AddItem(API.createMenuItem("" + nr + ".Box", "Select this textdraw")); nr++; }
			}
			Menu.Visible = true;
			TDEStatus = 0;
			nr = 0;
			Menu.OnItemSelect.connect(function(sender, item, index) 
			{	
				Menu.Visible = false;
				Menu = null;
				TDEStatus = 1;
				for(var i = 0; i < TextDraws; i++)
				{
					if (TextDrawType[i] < 1) continue;
					if(nr == index)
					{
						SelectedTD = i;
						API.sendChatMessage("~y~TDE EDITOR", "~w~You now editing textdraw #" + index);
						break;
					}
					nr++;
				}
			});
			Menu.OnMenuClose.connect(function()
			{
				Menu = false;
				TDEStatus = 1;
			});
			break;
		}
		case "Export":
		{
			if(TDEStatus == 0)
			{
				API.sendNotification("~r~TextDraw Editor is not active, [/tde]");
				return;
			}
			if(TextDraws < 1)
			{
				API.sendNotification("There are no textdraws created.");
				return;
			}

            API.triggerServerEvent("Export", "var res = API.getScreenResolutionMaintainRatio();");
			
			for(var i = 0; i < TextDraws; i++)
			{
                var string;
                var res = API.getScreenResolutionMaintainRatio();
                var posX = "0";
                var posY = "0";

                if (TextDrawFloatW[i] == 0) //left
                    posX = TextDrawPosX[i];
                else if (TextDrawFloatW[i] == 2) //right
                    posX = "res.Width - (res.Width - " + (res.Width - (res.Width - TextDrawPosX[i])) + ")";
                else //default center 
                {
                    var posLocX = (res.Width / 2);
                    posX = (TextDrawPosX[i] > posLocX) ? "(res.Width / 2) + " + ((res.Width - TextDrawPosX[i] - posLocX) * -1) : "(res.Width / 2) - " + (posLocX - TextDrawPosX[i]);
                }

                if (TextDrawFloatH[i] == 0) //left
                    posY = TextDrawPosY[i];
                else if (TextDrawFloatH[i] == 2) //right
                    posY = "res.Height - (res.Height - " + (res.Height - (res.Height - TextDrawPosY[i])) + ")";
                else //default center 
                {
                    var posLocY = (res.Height / 2);
                    posY = (TextDrawPosY[i] > posLocY) ? "(res.Height / 2) + " + ((res.Height - TextDrawPosY[i] - posLocY) * -1) : "(res.Height / 2) - " + (posLocY - TextDrawPosY[i]);
                }
                
				if(TextDrawType[i] == 1)
					string = "API.drawText('" + TextDrawText[i] + "', " + posX + ", " + posY + ", " + TextDrawWSize[i] + ", " + TextDrawR[i] + ", " + TextDrawG[i] + ", " + TextDrawB[i] + ", " + TextDrawA[i] + ", " + TextDrawFont[i] + ", " + TextDrawAligment[i] + ", " + TextDrawShadow[i] + ", " + TextDrawOutline[i] + ", 0); ";
				
				if(TextDrawType[i] == 2)
					string = "API.drawRectangle(" + posX + ", " + posY + ", " + TextDrawWSize[i] + ", " + TextDrawHSize[i] + ", " + TextDrawR[i] + ", " + TextDrawG[i] + ", " + TextDrawB[i] + ", " + TextDrawA[i] + ");";

                API.triggerServerEvent("Export", string);
			}
			break;
		}
	}
});

function ChangeColor(r, g, b, a)
{
	TextDrawR[SelectedTD] = Number(r);
	TextDrawG[SelectedTD] = Number(g);
	TextDrawB[SelectedTD] = Number(b);
	TextDrawA[SelectedTD] = Number(Math.floor(a));
}

function Move()
{
	if(TDEditing == 1 && API.isControlPressed(24))
	{
        var res = API.getScreenResolutionMaintainRatio();
        var posCursor = API.getCursorPositionMaintainRatio();
        var i = SelectedTD;
        
		if (TextDrawFloatW[i] == 0) //left
            TextDrawPosX[i] = posCursor.X;
		else if (TextDrawFloatW[i] == 2) //right
            TextDrawPosX[i] = res.Width - (res.Width - posCursor.X);
		else //default center 
		{
            var posX = (res.Width / 2);
            TextDrawPosX[i] = (posCursor.X > posX) ? posX + (posX - (res.Width - posCursor.X)) : posX - (posX - posCursor.X); 
		}
		
		if (TextDrawFloatH[i] == 0) //left
            TextDrawPosY[i] = posCursor.Y;
		else if (TextDrawFloatH[i] == 2) //right
            TextDrawPosY[i] = res.Height - (res.Height - posCursor.Y);
		else //default center 
		{
            var posY = (res.Height / 2);
            TextDrawPosY[i] = (posCursor.Y > posY) ? posY + (posY - (res.Height - posCursor.Y)) : posY - (posY - posCursor.Y);
        }

        //debug
        /*API.sendChatMessage("PosTD: " + TextDrawPosX[i] + ", " + TextDrawPosY[i]);
        API.sendChatMessage("PosCR: " + posCursor.X + ", " + posCursor.Y);*/
	}
}

function Debug()
{
    var i = SelectedTD;
    var res = API.getScreenResolutionMaintainRatio();
    var posX = "0";
    var posY = "0";

    if (TextDrawFloatW[i] == 0) //left
        posX = "X left: " + TextDrawPosX[i] + " | ";
    else if (TextDrawFloatW[i] == 2) //right
        posX = "X right: " + (res.Width - (res.Width - TextDrawPosX[i])) + " | ";
    else //default center 
    {
        var posLocX = (res.Width / 2);
        posX = (TextDrawPosX[i] > posLocX) ? "X center: " + ((res.Width - TextDrawPosX[i] - posLocX) * -1) + " | " : "X center: " + (posLocX - TextDrawPosX[i]) + " | ";
    }

    if (TextDrawFloatH[i] == 0) //left
        posY = "Y up: " + TextDrawPosY[i];
    else if (TextDrawFloatH[i] == 2) //right
        posY = "Y down: " + (res.Height - (res.Height - TextDrawPosY[i]));
    else //default center 
    {
        var posLocY = (res.Height / 2);
        posY = (TextDrawPosY[i] > posLocY) ? "Y center: " + ((res.Height - TextDrawPosY[i] - posLocY) * -1) : "Y center: " + (posLocY - TextDrawPosY[i]);
    }

    API.drawText('Debug: ' + posX + posY, (res.Width / 2), res.Height - 40, 0.4000000059604645, 255, 255, 255, 255, 0, 1, true, true, 0);
}