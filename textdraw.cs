using System;
using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Managers;
using System.IO;

public class TextDraw : Script 
{
	int _tdeStatus = 0;
	private string _fileName = "TDE_EXPORT";
	
	public TextDraw()
	{
		API.onClientEventTrigger += OnClientEventTrigger;
	}
	
	public void OnClientEventTrigger(Client playerid, string eventName, params object[] arguments)
	{
		if (eventName != "Export") return;
		var coordsFile = !File.Exists(_fileName + ".txt") ? new StreamWriter(_fileName + ".txt") : File.AppendText(_fileName + ".txt");
		coordsFile.WriteLine(arguments[0].ToString());
		coordsFile.Close();
	}	
		
	[Command("tde")]
	public void Tde(Client playerid)
	{
		if(_tdeStatus == 1)
		{
			API.sendNotificationToPlayer(playerid, "TextDraw editor is already active, [/tdeclose]");
			return;
		}
		API.triggerClientEvent(playerid, "Show_TDE");
		_tdeStatus = 1;
	}
	
	[Command("tdeclose", Alias = "tdcls")]
	public void TdeClose(Client playerid)
	{
		if(_tdeStatus == 0)
		{
			API.sendNotificationToPlayer(playerid, "TextDraw editor is already closed, [/tde]");
			return;
		}
		API.triggerClientEvent(playerid, "Close_TDE");
		_tdeStatus = 0;
	}
	
	[Command("tdcreate", "/createtd [1 - Text, 2 - Box]", Alias = "tdc")]
	public void TdCreate(Client playerid, int id)
	{
		if(id == 1 || id == 2) API.triggerClientEvent(playerid, "CreateTD", id);
		else API.sendNotificationToPlayer(playerid, "Invalid Type, 1 - Text, 2 - Box");
	}
	
	[Command("tdfloat", "/tdfloat width [0 - left, 1 - center, 2 - right], height [0 - up, 1 - center, 2 - down]", Alias = "tdf")]
	public void TdFloat(Client playerid, int bfloatWidth, int bfloatHeight)
	{
		if(bfloatWidth < 0 || bfloatWidth > 2 || bfloatHeight < 0 || bfloatHeight > 2)
		{
			API.sendNotificationToPlayer(playerid, "Invalid aligment (min 0, max 2)");
			return;
		}
		
		API.triggerClientEvent(playerid, "TDFloat", bfloatWidth, bfloatHeight);
	}
	
	[Command("aligment", "/aligment [0 - left, 1 - center, 2 - right]", Alias = "tda")]
	public void TdAligment(Client playerid, int aligment)
	{
		if(aligment < 0 || aligment > 2)
		{
			API.sendNotificationToPlayer(playerid, "Invalid aligment (min 0, max 2)");
			return;
		}
		
		API.triggerClientEvent(playerid, "TDAligment", aligment);
	}
	
	[Command("font", "/font [1-7]")]
	public void TdFont(Client playerid, int font)
	{
		if(font < 0 || font > 7)
		{
			API.sendNotificationToPlayer(playerid, "Invalid Font (min 0, max 7)");
			return;
		}
		
		API.triggerClientEvent(playerid, "TDFont", font);
	}
	
	[Command("shadow", "/shadow [0 - no, 1 - yes]", Alias = "tdsh")]
	public void TdShadow(Client playerid, int shadow)
	{
		if(shadow < 0 || shadow > 1)
		{
			API.sendNotificationToPlayer(playerid, "Invalid shadow (min 0, max 1)");
			return;
		}
		
		API.triggerClientEvent(playerid, "TDShadow", shadow > 0);
	}
	
	[Command("outline", "/outline [0 - no, 1 - yes]", Alias = "tdo")]
	public void TdOutline(Client playerid, int outline)
	{
		if(outline < 0 || outline > 1)
		{
			API.sendNotificationToPlayer(playerid, "Invalid outline (min 0, max 1)");
			return;
		}
		
		API.triggerClientEvent(playerid, "TDOutline", outline > 0);
	}
	
	[Command("tdcolor")]
	public void TdColor(Client playerid)
	{
		API.triggerClientEvent(playerid, "TDColor");
	}
	[Command("tdtext", "/tdtext [text]", Alias = "tdt", GreedyArg = true)]
	public void TdText(Client playerid, string text)
	{
		API.triggerClientEvent(playerid, "TDText", text);
	}
	
	[Command("tdremove", "/tdr", Alias = "tdr")]
	public void TdRemove(Client playerid)
	{
		API.triggerClientEvent(playerid, "TDRemove");
	}
	
	[Command("tdmove", "/tdm", Alias = "tdm")]
	public void TdMove(Client playerid)
	{
		API.triggerClientEvent(playerid, "TDMove");
	}
	
	[Command("tdsize", "/tdsize [width] [height]", Alias = "tds")]
	public void TdSize(Client playerid, float w, float h = 100f)
	{
		API.triggerClientEvent(playerid, "TDSize", w, h);
	}
	
	[Command("tdfilename", "/tdfilename [fileName]", Alias = "tdfm")]
	public void TdFileName(Client playerid, string saveFileName)
	{
		_fileName = saveFileName;
		playerid.sendChatMessage("~y~TDE: ~w~ new file name - ~g~" + saveFileName);
	}
	
	[Command("tdedit", "Using: /tded", Alias = "tded")]
	public void TdEdit(Client playerid)
	{
		API.triggerClientEvent(playerid, "EditTD");
	}
	
	[Command("tdexport", "Using: /tdexp", Alias = "tdexp")]
	public void TdExport(Client playerid)
	{
		var coordsFile = !File.Exists(_fileName + ".txt") ? new StreamWriter(_fileName + ".txt") : File.AppendText(_fileName + ".txt");
		var src = DateTime.Now;
		var sec = new DateTime(src.Year, src.Month, src.Day, src.Hour, src.Minute, src.Second);		
		coordsFile.WriteLine("// TDE EDITOR by [RW]Robi");
		coordsFile.WriteLine("// TextDraws generated on " + sec.Day + "." + sec.Month + "." + sec.Year + " - " + sec.Hour + ":" + sec.Minute + ":" + sec.Second);
		coordsFile.Close();
		
		API.triggerClientEvent(playerid, "Export");
		playerid.sendChatMessage("TextDraws has been exported, all textdraws are in the ~g~" + _fileName + ".txt~w~ file");
	}
	
	[Command("help")]
	public void TdShowHelp(Client playerid)
	{
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/font [0-7]");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/aligment (/tda) [0 - left, 1 - center, 2 - right]");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/tdfloat (/tdf) (Analog Float Css) [0 - left, 1 - center, 2 - right]");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/tdcreate (/tdc) [1 - Text, 2 - Box]");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/tdcolor (/tdcl) [rgba (0-255)]");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/tdmove (/tdm) - move the current textdraw.");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/tdsize (/tds) - change width / height size of the current textdraw.");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/tdtext (/tdt) - change text of the current textdraw.");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/tdeclose (/tdcls), /tdremove (/tdr), /tdexport (/tdexp), /tdedit (/tded), /tdfilename (/tdfm)");
		API.sendChatMessageToPlayer(playerid, "~y~TDE Commands:", "~w~/shadow (/tdsh) [0 - no, 1 - yes], /outline (/tdo) [0 - no, 1 - yes]");
		API.sendChatMessageToPlayer(playerid, "Type ~y~/tde ~w~for open the TDE Editor.");
	}
}