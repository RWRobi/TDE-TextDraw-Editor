using System;
using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Managers;
using System.IO;

namespace TextDraw
{
	public class TextDraw : Script 
	{
		private int _tdeStatus = 0;
		private string _fileName = "TDE_EXPORT";
		private ConfigData _configData = new ConfigData
		{
			Author = "[RW]Robi & Appi",
			Version = "0.3.3 Stable"
		};
		
		public TextDraw()
		{
			API.onClientEventTrigger += OnClientEventTrigger;
			API.onPlayerConnected += OnPlayerConnected;
			API.onResourceStart += OnResourceStart;
		}
			
		[Command("tde")]
		public void Tde(Client player)
		{
			if(_tdeStatus == 1)
			{
				API.sendNotificationToPlayer(player, "TextDraw editor is already active, [/tdeclose]");
				return;
			}
			
			API.triggerClientEvent(player, "Show_TDE");
			_tdeStatus = 1;
		}
		
		[Command("tdeclose", Alias = "tdcls")]
		public void TdeClose(Client player)
		{
			if(_tdeStatus == 0)
			{
				API.sendNotificationToPlayer(player, "TextDraw editor is already closed, [/tde]");
				return;
			}
			
			API.triggerClientEvent(player, "Close_TDE");
			_tdeStatus = 0;
		}
		
		[Command("tdcreate", "/createtd [1 - Text, 2 - Box]", Alias = "tdc")]
		public void TdCreate(Client player, int id)
		{
			if (id == 1 || id == 2) API.triggerClientEvent(player, "CreateTD", id);
			else API.sendNotificationToPlayer(player, "Invalid Type, 1 - Text, 2 - Box");
		}
		
		[Command("tdfloat", "/tdfloat width [0 - left, 1 - center, 2 - right], height [0 - up, 1 - center, 2 - down]", Alias = "tdf")]
		public void TdFloat(Client player, int bfloatWidth, int bfloatHeight)
		{
			if(bfloatWidth < 0 || bfloatWidth > 2 || bfloatHeight < 0 || bfloatHeight > 2)
			{
				API.sendNotificationToPlayer(player, "Invalid aligment (min 0, max 2)");
				return;
			}
			
			API.triggerClientEvent(player, "TDFloat", bfloatWidth, bfloatHeight);
		}
		
		[Command("aligment", "/aligment [0 - left, 1 - center, 2 - right]", Alias = "tda")]
		public void TdAligment(Client player, int aligment)
		{
			if(aligment < 0 || aligment > 2)
			{
				API.sendNotificationToPlayer(player, "Invalid aligment (min 0, max 2)");
				return;
			}
			
			API.triggerClientEvent(player, "TDAligment", aligment);
		}
		
		[Command("font", "/font [0-7]")]
		public void TdFont(Client player, int font)
		{
			if(font < 0 || font > 7)
			{
				API.sendNotificationToPlayer(player, "Invalid Font (min 0, max 7)");
				return;
			}
			
			API.triggerClientEvent(player, "TDFont", font);
		}
		
		[Command("shadow", "/shadow [0 - no, 1 - yes]", Alias = "tdsh")]
		public void TdShadow(Client player, int shadow)
		{
			if(shadow < 0 || shadow > 1)
			{
				API.sendNotificationToPlayer(player, "Invalid shadow (min 0, max 1)");
				return;
			}
			
			API.triggerClientEvent(player, "TDShadow", shadow > 0);
		}
		
		[Command("outline", "/outline [0 - no, 1 - yes]", Alias = "tdo")]
		public void TdOutline(Client player, int outline)
		{
			if(outline < 0 || outline > 1)
			{
				API.sendNotificationToPlayer(player, "Invalid outline (min 0, max 1)");
				return;
			}
			
			API.triggerClientEvent(player, "TDOutline", outline > 0);
		}
		
		[Command("tdcolor", Alias = "tdcl")]
		public void TdColor(Client player)
		{
			API.triggerClientEvent(player, "TDColor");
		}
		[Command("tdtext", "/tdtext [text]", Alias = "tdt", GreedyArg = true)]
		public void TdText(Client player, string text)
		{
			API.triggerClientEvent(player, "TDText", text);
		}
		
		[Command("tdremove", "/tdr", Alias = "tdr")]
		public void TdRemove(Client player)
		{
			API.triggerClientEvent(player, "TDRemove");
		}
		
		[Command("tdmove", "/tdm", Alias = "tdm")]
		public void TdMove(Client player)
		{
			API.triggerClientEvent(player, "TDMove");
		}
		
		[Command("tdsize", "/tdsize [width] [height]", Alias = "tds")]
		public void TdSize(Client player, float w, float h = 100f)
		{
			API.triggerClientEvent(player, "TDSize", w, h);
		}
		
		[Command("tdfilename", "/tdfilename [fileName]", Alias = "tdfn")]
		public void TdFileName(Client player, string saveFileName)
		{
			_fileName = saveFileName;
			player.sendChatMessage("~y~TDE: ~w~ new file name - ~g~" + saveFileName);
		}
		
		[Command("tdedit", "Using: /tded", Alias = "tded")]
		public void TdEdit(Client player)
		{
			API.triggerClientEvent(player, "EditTD");
		}
		
		[Command("tdexport", "Using: /tdexp", Alias = "tdexp")]
		public void TdExport(Client player)
		{
			var coordsFile = !File.Exists(_fileName + ".txt") ? new StreamWriter(_fileName + ".txt") : File.AppendText(_fileName + ".txt");
			var src = DateTime.Now;
			var sec = new DateTime(src.Year, src.Month, src.Day, src.Hour, src.Minute, src.Second);	
			
			coordsFile.WriteLine("//TDE EDITOR by " + _configData.Author + ", v" + _configData.Version);
			coordsFile.WriteLine("//TextDraws generated on " + sec.Day + "." + sec.Month + "." + sec.Year + " - " + sec.Hour + ":" + sec.Minute + ":" + sec.Second);
			coordsFile.Close();
			
			API.triggerClientEvent(player, "Export");
			player.sendChatMessage("TextDraws has been exported, all textdraws are in the ~g~" + _fileName + ".txt~w~ file");
		}
		
		[Command("help")]
		public void TdShowHelp(Client player)
		{
			ShowHelp(player);
		}
		
		[Command("tddebug", Alias = "tdd")]
		public void TdDebug(Client player)
		{
			API.triggerClientEvent(player, "TDEDebug");
		}
		
	   /*
		*
		* Methods
		*
		*/
		
		public void OnResourceStart()
		{
			API.consoleOutput("====================[TDE]====================");
			API.consoleOutput("TextDraw Editor was loaded v" + _configData.Version);
			API.consoleOutput("Authors: " + _configData.Author);
			API.consoleOutput("=============================================");
		}
		
		public void OnPlayerConnected(Client player)
		{
			player.triggerEvent("SetConfig", _configData.Author, _configData.Version);
			player.sendChatMessage("TDE Editor " + _configData.Version + " by ~r~" + _configData.Author);
			player.sendChatMessage("Type ~y~/tde ~w~for open the TDE Editor.");
		}
		
		public void OnClientEventTrigger(Client player, string eventName, params object[] arguments)
		{
			switch (eventName)
			{
				case "Export":
					var coordsFile = !File.Exists(_fileName + ".txt") ? new StreamWriter(_fileName + ".txt") : File.AppendText(_fileName + ".txt");
					coordsFile.WriteLine(arguments[0].ToString());
					coordsFile.Close();
					break;
				case "Help":
					ShowHelp(player);
					break;
			}
		}	

		public void ShowHelp(Client player)
		{
			player.triggerEvent("OpenHelpWindow");
			/*player.sendChatMessage("~y~TDE Commands:", "~w~/font [0-7]");
			player.sendChatMessage("~y~TDE Commands:", "~w~/aligment (/tda) [0 - left, 1 - center, 2 - right]");
			player.sendChatMessage("~y~TDE Commands:", "~w~/tdfloat (/tdf) (Analog Float Css) [0 - left, 1 - center, 2 - right]");
			player.sendChatMessage("~y~TDE Commands:", "~w~/tdcreate (/tdc) [1 - Text, 2 - Box]");
			player.sendChatMessage("~y~TDE Commands:", "~w~/tdcolor (/tdcl) [rgba (0-255)]");
			player.sendChatMessage("~y~TDE Commands:", "~w~/tdmove (/tdm) - move the current textdraw.");
			player.sendChatMessage("~y~TDE Commands:", "~w~/tdsize (/tds) - change width / height size of the current textdraw.");
			player.sendChatMessage("~y~TDE Commands:", "~w~/tdtext (/tdt) - change text of the current textdraw.");
			player.sendChatMessage("~y~TDE Commands:", "~w~/shadow (/tdsh) [0 - no, 1 - yes], /outline (/tdo) [0 - no, 1 - yes]");
			player.sendChatMessage("Type ~y~/tde ~w~for open the TDE Editor.");*/
		}
	}
		
	public struct ConfigData
	{
		public string Author { get; set; }
		public string Version { get; set; }
	}
}