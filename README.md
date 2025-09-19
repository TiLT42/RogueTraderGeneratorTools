# Rogue Trader Generator Tools
The Rogue Trader Generator Tools is a Windows desktop application that automates all of the dice rolling from the various generators in the Rogue Trader line of roleplaying games, made by Fantasy Flight Games under license by Games Workshop. The Rogue Trader Generator Tools and its author are not affiliated with either party.

The main focus of the tools is to cover the sprawling system generation in the Stars of Inequity splatbook. Building a system by going through the book and rolling dice can take hours. The Rogue Trader Generator Tools does it for you in a fraction of a second. The generator builds a solar system according to the rules of that book and fills it with planets, system features, and even flora and fauna. 

The generator covers content from the following books:
- The Rogue Trader Core Rulebook
- Stars of Inequity
- The Koronus Bestiary (adds an alternate, more detailed method of generating Xenos. Also allows generating primitive species)
- Into the Storm (adds additional hulls and components for starship generation)
- Battlefleet Koronus (enables generation of Xenos and Chaos ships used in pirate fleets and starship graveyards)
- The Soul Reaver (adds Dark Eldar to the selection of races that can be encountered in space)

You may freely configure the generator to use only the books you wish to include. Please note that you will need the selected books to use the generated results.

To download the latest version of the generator, please navigate to the releases page found at https://github.com/TiLT42/RogueTraderGeneratorTools/releases/

If you wish to add your own modifications to the generator, feel free to fork the repository and submit pull requests.

#### UPDATE 16.09.25
I'm currently using Copilot to migrate the app to Electron as a test. The WPF platform is getting a little old, and there's still an audience for this app, so I'm hoping to modernize it a little. The master branch may become unstable during this time (but hopefully not), so if you want to avoid that, use the classic-wpf branch in the meantime. 
If you wish to contribute to the Electron update, feel free to add pull requests. I'm hoping to move away from the typical Windows layout and make this compatible with web browsers eventually, but it will take some work.

#### UPDATE 19.09.25
There has been a very thorough conversion process heavily aided by GitHub Copilot's GPT-5 mode and GitHub Copilot Agent. As a first pass, it created a functioning mockup of the app, and since then, it has finished multiple passes of audits, conversions, parity checks, and bug fixes. I have supervised every step of this journey, although the complexity and scope of this project mean that I don't yet have a complete picture of the changes. However, the audits combined with my testing are enough that I feel like declaring that the generator part of the app has now reached at least 95% parity with the original WPF app. Any discrepancies at this point are likely to be extremely small. There are a couple of small but cool new features added, most notably a random name generator for systems, planets, and gas giants.

Having said that, everything surrounding the generator functions needs serious development. The UI is a mess right now, with ludicrous color choices and weird iconography. Your settings don't appear to be retained when you restart the app. Saving and loading workspaces should work *in theory*, but haven't been tested. Context menus are underdeveloped and may contain references to functionality that doesn't exist and will likely never exist. Formatting for the generated documents is all over the place, although it's getting closer to where I want it.
Feel free to try it out if you've got the knowledge of how to run an Electron app. It should be compatible with Windows, Mac, and Linux, though the interface is very Windows-like at this point.

The WPF code has not been touched and should work the same as always, but I don't intend to continue supporting it.
