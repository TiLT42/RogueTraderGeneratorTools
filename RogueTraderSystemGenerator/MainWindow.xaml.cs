using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media.Imaging;
using Microsoft.Win32;
using RogueTraderSystemGenerator.Nodes;

namespace RogueTraderSystemGenerator
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        private ObservableCollection<NodeBase> _rootNodes = new ObservableCollection<NodeBase>();
        private string _saveFileName = "";
        private bool _dirty;

        public MainWindow()
        {
            InitializeComponent();

            //_rootNode = new RootNode(GetNewId());
            TreeNodes.ItemsSource = _rootNodes;

            if(Properties.Settings.Default.SettingsCreated == false)
            {
                MessageBox.Show("Since this appears to be your first time running the Rogue Trader System Generator, let's take a moment to configure your settings. ");
                SettingsWindow window = new SettingsWindow();
                window.ShowDialog();

                MessageBox.Show("Remember, you can always bring up this configuration screen again from the menus. Feel free to experiment with various combinations. Have fun! ");
                Properties.Settings.Default.SettingsCreated = true;
                Properties.Settings.Default.Save();
            }
            PageReferenceCheckBox.IsChecked = Properties.Settings.Default.ShowPageNumbers;
            CollateNodesCheckBox.IsChecked = Properties.Settings.Default.MergeWithChildDocuments;

            ClearAndCreateNewWorkspace();
            UpdateMenuItemAvailability();
        }

        private void GenerateSystems(int amount = 1)
        {
            for(int i = 0; i < amount; i++)
            {
                SystemNode system = new SystemNode("Unnamed System");
                _rootNodes.Add(system);
                system.Generate();
            }
        }

        private NodeBase GetSelectedNode()
        {
            var selectedItem = TreeNodes.SelectedItem as NodeBase;
            if (selectedItem == null)
                return null;
            return selectedItem;
        }

        private void TreeNodesSelectedItemChanged1(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            var selectedItem = TreeNodes.SelectedItem as NodeBase;

            if (selectedItem == null)
                TreeNodes.ContextMenu = null;
            else if (selectedItem is SystemNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["SystemContext"] as ContextMenu;
            else if (selectedItem is ZoneNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["ZoneContext"] as ContextMenu;
            else if (selectedItem is PlanetNode && ((PlanetNode) selectedItem).IsMoon)
                TreeNodes.ContextMenu = TreeNodes.Resources["MoonContext"] as ContextMenu;
            else if (selectedItem is PlanetNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["PlanetContext"] as ContextMenu;
            else if (selectedItem is XenosNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["XenosContext"] as ContextMenu;
            else if (selectedItem is OrbitalFeaturesNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["OrbitalFeaturesContext"] as ContextMenu;
            else if (selectedItem is GasGiantNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["GasGiantContext"] as ContextMenu;
            else if (selectedItem is ShipNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["StarshipContext"] as ContextMenu;
            else if (selectedItem is TreasureNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["TreasureContext"] as ContextMenu;
            else if (selectedItem is NativeSpeciesNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["NativeSpeciesContext"] as ContextMenu;
            else if (selectedItem is PirateShipsNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["PirateShipsContext"] as ContextMenu;
            else if (selectedItem is DustCloudNode ||
                     selectedItem is GravityRiptideNode ||
                     selectedItem is RadiationBurstsNode ||
                     selectedItem is SolarFlaresNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["GeneralNodeNoGenerateContext"] as ContextMenu;
            else if (selectedItem is LesserMoonNode ||
                     selectedItem is AsteroidNode ||
                     selectedItem is AsteroidBeltNode ||
                     selectedItem is AsteroidClusterNode ||
                     selectedItem is DerelictStationNode ||
                     selectedItem is StarshipGraveyardNode)
                TreeNodes.ContextMenu = TreeNodes.Resources["GeneralNodeContext"] as ContextMenu;
            else
                TreeNodes.ContextMenu = null;

            if (selectedItem != null)
            {
                selectedItem.GenerateFlowDocument();
                DescriptionView.Document = selectedItem.GetFlowDocument();
            }
            else
            {
                DescriptionView.Document = null;
            }
        }

        private void GenerateClick(object sender, RoutedEventArgs e)
        {
            NodeBase node = GetSelectedNode();
            if (node != null)
            {
                if (node.IsNodeTreeDirty() &&
                    MessageBox.Show("You have unsaved changes in nodes that are owned by the one you wish to Generate. All these nodes will be deleted. Are you sure you wish to proceed?", "Generate System", MessageBoxButton.YesNo, MessageBoxImage.Warning) ==
                    MessageBoxResult.No)
                {
                    return;
                }

                node.ResetVariables();
                node.Generate(true);
                node.GenerateFlowDocument();
                DescriptionView.Document = node.GetFlowDocument();
                node.RemoveDirtyFlag();
                //node.Dirty = true;
            }
        }

        private void AddPlanetClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddPlanet();
                zoneNode.Dirty = true;
            }
        }

        private void RenameSystemClick(object sender, RoutedEventArgs e)
        {
            InputDialog dlg = new InputDialog {MessageToUser = {Text = "What name would you like this star system to have?"}};
            dlg.ShowDialog();
            if (dlg.DialogResult == true)
            {
                var systemNode = GetSelectedNode() as SystemNode;
                if (systemNode != null)
                {
                    systemNode.NodeName = dlg.UserInput.Text;
                    GenerateNames();
                    systemNode.GenerateFlowDocument();
                    DescriptionView.Document = systemNode.GetFlowDocument();
                    systemNode.Dirty = true;
                }
            }
        }

        private void RenameXenosClick(object sender, RoutedEventArgs e)
        {
            InputDialog dlg = new InputDialog {MessageToUser = {Text = "What name would you like this Xenos species to have?"}};
            dlg.ShowDialog();
            if (dlg.DialogResult == true)
            {
                var xenosNode = GetSelectedNode() as XenosNode;
                if (xenosNode != null)
                {
                    xenosNode.NodeName = dlg.UserInput.Text;
                    GenerateNames();
                    xenosNode.GenerateFlowDocument();
                    DescriptionView.Document = xenosNode.GetFlowDocument();
                    xenosNode.Dirty = true;
                }
            }
        }

        private void RenamePlanetClick(object sender, RoutedEventArgs e)
        {
            InputDialog dlg = new InputDialog {MessageToUser = {Text = "What name would you like this planet to have?"}};
            dlg.ShowDialog();
            if (dlg.DialogResult == true)
            {
                var planetNode = GetSelectedNode() as PlanetNode;
                if (planetNode != null)
                {
                    planetNode.CustomName = dlg.UserInput.Text;
                    GenerateNames();
                    planetNode.GenerateFlowDocument();
                    DescriptionView.Document = planetNode.GetFlowDocument();
                    planetNode.Dirty = true;
                }
            }
        }

        private void RenameGasGiantClick(object sender, RoutedEventArgs e)
        {
            InputDialog dlg = new InputDialog {MessageToUser = {Text = "What name would you like this gas giant to have?"}};
            dlg.ShowDialog();
            if (dlg.DialogResult == true)
            {
                var planetNode = GetSelectedNode() as GasGiantNode;
                if (planetNode != null)
                {
                    planetNode.CustomName = dlg.UserInput.Text;
                    GenerateNames();
                    planetNode.GenerateFlowDocument();
                    DescriptionView.Document = planetNode.GetFlowDocument();
                    planetNode.Dirty = true;
                }
            }
        }

        private void RenameClick(object sender, RoutedEventArgs e)
        {
            InputDialog dlg = new InputDialog {MessageToUser = {Text = "What name would you like this node to have?"}};
            dlg.ShowDialog();
            if (dlg.DialogResult == true)
            {
                var node = GetSelectedNode();
                if (node != null)
                {
                    node.CustomName = dlg.UserInput.Text;
                    //node.NodeName = dlg.UserInput.Text;
                    GenerateNames();
                    node.GenerateFlowDocument();
                    DescriptionView.Document = node.GetFlowDocument();
                    node.Dirty = true;
                }
            }
        }

        private void PageReferenceCheckBoxChecked(object sender, RoutedEventArgs e)
        {
            Properties.Settings.Default.ShowPageNumbers = true;
            Properties.Settings.Default.Save();
            if (GetSelectedNode() != null)
            {
                GetSelectedNode().GenerateFlowDocument();
                DescriptionView.Document = GetSelectedNode().GetFlowDocument();
            }
        }

        private void PageReferenceCheckBoxUnchecked(object sender, RoutedEventArgs e)
        {
            Properties.Settings.Default.ShowPageNumbers = false;
            Properties.Settings.Default.Save();
            if (GetSelectedNode() != null)
            {
                GetSelectedNode().GenerateFlowDocument();
                DescriptionView.Document = GetSelectedNode().GetFlowDocument();
            }
        }

        private void CollateNodesCheckBoxChecked(object sender, RoutedEventArgs e)
        {
            Properties.Settings.Default.MergeWithChildDocuments = true;
            Properties.Settings.Default.Save();
            if (GetSelectedNode() != null)
            {
                GetSelectedNode().GenerateFlowDocument();
                DescriptionView.Document = GetSelectedNode().GetFlowDocument();
            }
        }

        private void CollateNodesCheckBoxUnchecked(object sender, RoutedEventArgs e)
        {
            Properties.Settings.Default.MergeWithChildDocuments = false;
            Properties.Settings.Default.Save();
            if (GetSelectedNode() != null)
            {
                GetSelectedNode().GenerateFlowDocument();
                DescriptionView.Document = GetSelectedNode().GetFlowDocument();
            }
        }

        private void SaveAsClick(object sender, RoutedEventArgs e)
        {
            Save();
        }

        private void SaveClick(object sender, RoutedEventArgs e)
        {
            Save(_saveFileName);
        }

        private void Save(string fileName = "")
        {
            string currentFileName;
            if (fileName == "")
            {
                SaveFileDialog saveDlg = new SaveFileDialog {Filter = "Rogue Trader Generator File|*.rtg", Title = "Save Your Generated Data"};
                saveDlg.ShowDialog();
                currentFileName = saveDlg.FileName;
            }
            else
                currentFileName = fileName;

            if (currentFileName != "")
            {
                _saveFileName = currentFileName;
                try
                {
                    using (FileStream fs = new FileStream(currentFileName, FileMode.Create, FileAccess.Write))
                    {
                        var formatter = new DataContractSerializer(typeof(ObservableCollection<NodeBase>));
                        formatter.WriteObject(fs, _rootNodes);
                        _dirty = false;
                        foreach (var node in _rootNodes)
                        {
                            node.RemoveDirtyFlag();
                        }
                    }
                }   
                catch(Exception ex)
                {
                    MessageBox.Show("An error occured while attempting to save your file. The error was: " + ex.Message + "\n\nException: " + ex.InnerException);
                }
            }
        }

        private void OpenClick(object sender, RoutedEventArgs e)
        {
            if (IsWorkspaceDirty())
            {
                if (MessageBox.Show("You have unsaved changes that will be lost if you open a workspace from disk. Are you sure you wish to do this?", "Confirm Open", MessageBoxButton.YesNo,
                                    MessageBoxImage.Exclamation) == MessageBoxResult.No)
                    return;
            }

            OpenFileDialog openDlg = new OpenFileDialog {Filter = "Rogue Trader Generator File|*.rtg", Title = "Load Generated Data"};
            openDlg.ShowDialog();

            if (openDlg.FileName != "")
            {
                try
                {
                    using (FileStream fs = new FileStream(openDlg.FileName, FileMode.Open, FileAccess.Read))
                    {
                        ClearNodes();
                        var formatter = new DataContractSerializer(typeof (ObservableCollection<NodeBase>));
                        _rootNodes = (ObservableCollection<NodeBase>) formatter.ReadObject(fs);
                        TreeNodes.ItemsSource = _rootNodes;
                        _dirty = false;
                        _saveFileName = openDlg.FileName;
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("An error occured while attempting to open the file. The error was: " + ex.Message + "\n\nException: " + ex.InnerException);
                    _saveFileName = "";
                }
            }
        }

        private void ClearNodes()
        {
            _rootNodes.Clear();
            DescriptionView.Document = null;
            _dirty = false;
        }

        private void NewClick(object sender, RoutedEventArgs e)
        {
            ClearAndCreateNewWorkspace();
        }

        private void ExitClick(object sender, RoutedEventArgs e)
        {
            ExitApplication();
        }

        private void ExitApplication()
        {
            if (IsWorkspaceDirty())
            {
                if (MessageBox.Show("You have unsaved changes. Are you sure you wish to exit without saving?", "Confirm Exit", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
                    Close();
            }
            else
            {
                if (MessageBox.Show("Are you sure you wish to exit?", "Confirm Exit", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
                    Close();
            }
        }

        private void ClearAndCreateNewWorkspace()
        {
            if (IsWorkspaceDirty())
            {
                if (MessageBox.Show("You've made changes to the workspace since it was generated. Generating a new workspace will delete these changes. Are you sure you wish to do this?", "Confirm New", MessageBoxButton.YesNo,
                                    MessageBoxImage.Exclamation) == MessageBoxResult.No)
                    return;
            }
            ClearNodes();
            _saveFileName = "";
        }

        private bool IsWorkspaceDirty()
        {
            if (_dirty)
                return true;
            return _rootNodes.Any(node => node.IsNodeTreeDirty());
        }

        private void WindowClosing1(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (IsWorkspaceDirty())
            {
                if (MessageBox.Show("You have unsaved changes. Are you sure you wish to exit without saving?", "Confirm Exit", MessageBoxButton.YesNo) == MessageBoxResult.No)
                    e.Cancel = true;
            }
            else
            {
                if (MessageBox.Show("Are you sure you wish to exit?", "Confirm Exit", MessageBoxButton.YesNo) == MessageBoxResult.No)
                    e.Cancel = true;
            }
        }

        private void DeleteNodeClick(object sender, RoutedEventArgs e)
        {
            DeleteNode();
        }

        private void DeleteNode()
        {
            NodeBase node = GetSelectedNode();
            if (node != null)
            {
                if (MessageBox.Show("This will permanently delete this node and all its children from your workspace. This operation cannot be reversed. Are you sure you wish to delete the node?", "Confirm Delete", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
                {
                    if (node.Parent == null)
                        _rootNodes.Remove(node);
                    else
                        node.Parent.Children.Remove(node);
                    DescriptionView.Document = null;
                    _dirty = true;
                    GenerateNames();
                }
            }
        }

        private void NewSystemClick(object sender, RoutedEventArgs e)
        {
            GenerateSystems();
        }

        private void GenerateXenos(WorldType worldType, int amount = 1)
        {
            for (int i = 0; i < amount; i++)
            {
                XenosNode xenos = new XenosNode(worldType, false, new SystemCreationRules());
                _rootNodes.Add(xenos);
                xenos.Generate();
            }
        }

        private void GeneratePrimitiveSpecies(int amount = 1)
        {
            for (int i = 0; i < amount; i++)
            {
                XenosNode xenos = new XenosNode(WorldType.TemperateWorld, true, new SystemCreationRules());
                _rootNodes.Add(xenos);
                xenos.Generate();
            }
        }

        private void RandomWorldXenosClick(object sender, RoutedEventArgs e)
        {
            WorldType worldType;
            switch(Globals.Rand.Next(7))
            {
                case 0:
                    worldType = WorldType.TemperateWorld;
                    break;
                case 1:
                    worldType = WorldType.DeathWorld;
                    break;
                case 2:
                    worldType = WorldType.DesertWorld;
                    break;
                case 3:
                    worldType = WorldType.IceWorld;
                    break;
                case 4:
                    worldType = WorldType.JungleWorld;
                    break;
                case 5:
                    worldType = WorldType.OceanWorld;
                    break;
                case 6:
                    worldType = WorldType.VolcanicWorld;
                    break;
                default:
                    throw new Exception("Invalid result when rolling for random world type for new xenos");
            }
            GenerateXenos(worldType);

        }

        private void TemperateWorldXenosClick(object sender, RoutedEventArgs e)
        {
            GenerateXenos(WorldType.TemperateWorld);
        }

        private void DeathWorldXenosClick(object sender, RoutedEventArgs e)
        {
            GenerateXenos(WorldType.DeathWorld);
        }

        private void DesertWorldXenosClick(object sender, RoutedEventArgs e)
        {
            GenerateXenos(WorldType.DesertWorld);
        }

        private void IceWorldXenosClick(object sender, RoutedEventArgs e)
        {
            GenerateXenos(WorldType.IceWorld);
        }

        private void JungleWorldXenosClick(object sender, RoutedEventArgs e)
        {
            GenerateXenos(WorldType.JungleWorld);
        }

        private void OceanWorldXenosClick(object sender, RoutedEventArgs e)
        {
            GenerateXenos(WorldType.OceanWorld);
        }

        private void VolcanicWorldXenosClick(object sender, RoutedEventArgs e)
        {
            GenerateXenos(WorldType.VolcanicWorld);
        }

        private void NewPrimitiveSpeciesClick(object sender, RoutedEventArgs e)
        {
            GeneratePrimitiveSpecies();
        }

        private void NewRandomTreasureClick(object sender, RoutedEventArgs e)
        {
            GenerateTreasure();
        }

        private void GenerateTreasure(TreasureOrigin origin, int amount = 1)
        {
            for (int i = 0; i < amount; i++)
            {
                TreasureNode treasure = new TreasureNode(origin);
                _rootNodes.Add(treasure);
                treasure.Generate();
            }
        }

        private void GenerateTreasure(int amount = 1)
        {
            for (int i = 0; i < amount; i++)
            {
                TreasureNode treasure = new TreasureNode();
                _rootNodes.Add(treasure);
                treasure.Generate();
            }
        }

        private void NewFinelyWroughtTreasureClick(object sender, RoutedEventArgs e)
        {
            GenerateTreasure(TreasureOrigin.FinelyWrought);
        }

        private void NewAncientMiracleTreasureClick(object sender, RoutedEventArgs e)
        {
            GenerateTreasure(TreasureOrigin.AncientMiracle);
        }

        private void NewAlienTechnologyTreasureClick(object sender, RoutedEventArgs e)
        {
            GenerateTreasure(TreasureOrigin.AlienTechnology);
        }

        private void NewCursedArtefactTreasureClick(object sender, RoutedEventArgs e)
        {
            GenerateTreasure(TreasureOrigin.CursedArtefact);
        }

        private void ExportPdfClick(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Not supported");
        }

        private void PrintClick(object sender, RoutedEventArgs e)
        {
            Print();
        }

        private void ExportRtfClick(object sender, RoutedEventArgs e)
        {
            bool originalMergeSetting = Properties.Settings.Default.MergeWithChildDocuments;
            Properties.Settings.Default.MergeWithChildDocuments = true;
            try
            {
                SaveFileDialog saveDlg = new SaveFileDialog {Filter = "Rich Text Format|*.rtf", Title = "Export to RTF"};
                saveDlg.ShowDialog();
                string currentFileName = saveDlg.FileName;

                if (currentFileName != "")
                {
                    //_saveFileName = currentFileName;
                    try
                    {
                        FlowDocument mainDoc = null;
                        foreach (NodeBase node in _rootNodes)
                        {
                            node.GenerateFlowDocument();
                            if (mainDoc == null)
                                mainDoc = node.GetFlowDocument();
                            else
                                node.MergeFlowDocuments(ref mainDoc, node.GetFlowDocument());
                        }
                        using (FileStream fs = new FileStream(currentFileName, FileMode.OpenOrCreate, FileAccess.Write))
                        {
                            if (mainDoc != null)
                            {
                                TextRange textRange = new TextRange(mainDoc.ContentStart, mainDoc.ContentEnd);
                                textRange.Save(fs, DataFormats.Rtf);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("An error occured while attempting to save your file. The error was: " + ex.Message + "\n\nException: " + ex.InnerException);
                    }
                }
            }
            finally
            {
                Properties.Settings.Default.MergeWithChildDocuments = originalMergeSetting;
            }
        }

        private void AddMoonClick(object sender, RoutedEventArgs e)
        {
            if (GetSelectedNode() is PlanetNode)
            {
                var planetNode = GetSelectedNode() as PlanetNode;
                if (planetNode != null) planetNode.AddMoon();
            }
            else if(GetSelectedNode() is OrbitalFeaturesNode)
            {
                if (GetSelectedNode().Parent is PlanetNode)
                {
                    var planetNode = GetSelectedNode().Parent as PlanetNode;
                    if (planetNode != null) planetNode.AddMoon();
                }
                else if (GetSelectedNode().Parent is GasGiantNode)
                {
                    var planetNode = GetSelectedNode().Parent as GasGiantNode;
                    if (planetNode != null) planetNode.AddMoon();
                }
            }
            else if (GetSelectedNode() is GasGiantNode)
            {
                var planetNode = GetSelectedNode() as GasGiantNode;
                if (planetNode != null) planetNode.AddMoon();
            }
            else
                throw new Exception("Attempted to generate a moon from the wrong node source");
            GenerateNames();
            GetSelectedNode().Dirty = true;
        }

        private void AddLesserMoonClick(object sender, RoutedEventArgs e)
        {
            if (GetSelectedNode() is PlanetNode)
            {
                var planetNode = GetSelectedNode() as PlanetNode;
                if (planetNode != null) planetNode.AddLesserMoon();
            }
            else if (GetSelectedNode() is OrbitalFeaturesNode)
            {
                if (GetSelectedNode().Parent is PlanetNode)
                {
                    var planetNode = GetSelectedNode().Parent as PlanetNode;
                    if (planetNode != null) planetNode.AddLesserMoon();
                }
                else if (GetSelectedNode().Parent is GasGiantNode)
                {
                    var planetNode = GetSelectedNode().Parent as GasGiantNode;
                    if (planetNode != null) planetNode.AddLesserMoon();
                }
            }
            else if (GetSelectedNode() is GasGiantNode)
            {
                var planetNode = GetSelectedNode() as GasGiantNode;
                if (planetNode != null) planetNode.AddLesserMoon();
            }
            else
                throw new Exception("Attempted to generate a lesser moon from the wrong node source");
            GenerateNames();
            GetSelectedNode().Dirty = true;
        }

        private void AddAsteroidClick(object sender, RoutedEventArgs e)
        {
            if (GetSelectedNode() is PlanetNode)
            {
                var planetNode = GetSelectedNode() as PlanetNode;
                if (planetNode != null) planetNode.AddAsteroid();
            }
            else if (GetSelectedNode() is OrbitalFeaturesNode)
            {
                if (GetSelectedNode().Parent is PlanetNode)
                {
                    var planetNode = GetSelectedNode().Parent as PlanetNode;
                    if (planetNode != null) planetNode.AddAsteroid();
                }
                else if (GetSelectedNode().Parent is GasGiantNode)
                {
                    var planetNode = GetSelectedNode().Parent as GasGiantNode;
                    if (planetNode != null) planetNode.AddAsteroid();
                }
            }
            else if (GetSelectedNode() is GasGiantNode)
            {
                var planetNode = GetSelectedNode() as GasGiantNode;
                if (planetNode != null) planetNode.AddAsteroid();
            }
            else
                throw new Exception("Attempted to generate an asteroid from the wrong node source");
            GenerateNames();
            GetSelectedNode().Dirty = true;
        }

        private void GenerateNames()
        {
            foreach (NodeBase node in _rootNodes)
            {
                SystemNode systemNode = node as SystemNode;
                if (systemNode != null)
                    systemNode.GenerateNames();
            }
        }

        private void EditDescriptionClick(object sender, RoutedEventArgs e)
        {
            NodeBase node = GetSelectedNode();
            if (node == null)
                return;

            string oldDescription = node.Description;

            DescriptionDialog dlg = new DescriptionDialog {MessageToUser = {Text = "Please enter a description for this node."}, UserInput = {Text = node.Description}};
            dlg.ShowDialog();
            if (dlg.DialogResult == true)
            {
                node.Description = dlg.UserInput.Text;
                node.GenerateFlowDocument();
                DescriptionView.Document = node.GetFlowDocument();

                if (String.Compare(node.Description, oldDescription, StringComparison.Ordinal) != 0)
                    node.Dirty = true;
            }
        }

        private void AddShipGraveyardClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddStarshipGraveyard();
                zoneNode.Dirty = true;
            }
        }

        private void AddGasGiantClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddGasGiant();
                zoneNode.Dirty = true;
            }
            GenerateNames();
        }

        private void AddAsteroidBeltClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddAsteroidBelt();
                zoneNode.Dirty = true;
            }
        }

        private void AddAsteroidClusterClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddAsteroidCluster();
                zoneNode.Dirty = true;
            }
        }

        private void AddDerelictStationClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddDerelictStation();
                zoneNode.Dirty = true;
            }
        }

        private void AddDustCloudClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddDustCloud();
                zoneNode.Dirty = true;
            }
        }

        private void AddGravityRiptideClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddGravityRiptide();
                zoneNode.Dirty = true;
            }
        }

        private void AddRadiationBurstsClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddRadiationBursts();
                zoneNode.Dirty = true;
            }
        }

        private void AddSolarFlaresClick(object sender, RoutedEventArgs e)
        {
            var zoneNode = GetSelectedNode() as ZoneNode;
            if (zoneNode != null)
            {
                zoneNode.AddSolarFlares();
                zoneNode.Dirty = true;
            }
        }

        private void SaveCanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = true;
        }

        private void SaveExecuted(object sender, ExecutedRoutedEventArgs e)
        {
            Save(_saveFileName);
        }

        private void PrintCanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = true;
        }

        private void PrintExecuted(object sender, ExecutedRoutedEventArgs e)
        {
            Print();
        }

        private void Print()
        {
            bool originalMergeSetting = Properties.Settings.Default.MergeWithChildDocuments;
            Properties.Settings.Default.MergeWithChildDocuments = true;
            try
            {
                if (_rootNodes.Count == 0)
                    return;

                FlowDocument mainDoc = null;
                foreach (NodeBase node in _rootNodes)
                {
                    node.GenerateFlowDocument();
                    if (mainDoc == null)
                        mainDoc = node.GetFlowDocument();
                    else
                        node.MergeFlowDocuments(ref mainDoc, node.GetFlowDocument());
                }
                PrintDialog pd = new PrintDialog();
                if (mainDoc != null)
                {
                    mainDoc.PageHeight = pd.PrintableAreaHeight;
                    mainDoc.PageWidth = pd.PrintableAreaWidth;
                    mainDoc.PagePadding = new Thickness(50);
                    mainDoc.ColumnGap = 0;
                    mainDoc.ColumnWidth = pd.PrintableAreaWidth;

                    IDocumentPaginatorSource dps = mainDoc;
                    if (pd.ShowDialog() == true)
                        pd.PrintDocument(dps.DocumentPaginator, "Workspace");
                }
            }
            finally
            {
                Properties.Settings.Default.MergeWithChildDocuments = originalMergeSetting;
            }
        }

        private void NewStarshipClick(object sender, RoutedEventArgs e)
        {
            GenerateStarship();
        }

        private void GenerateStarship(int amount = 1)
        {
            for (int i = 0; i < amount; i++)
            {
                Starship ship = new Starship();
                StarshipTools.GenerateRandomHumanPirateShip(ref ship);
                ShipNode shipNode = new ShipNode(ship);
                _rootNodes.Add(shipNode);
                shipNode.Generate();
            }
        }

        private void ConfigureClick(object sender, RoutedEventArgs e)
        {
            SettingsWindow window = new SettingsWindow();
            window.ShowDialog();
            Properties.Settings.Default.Save();
            UpdateMenuItemAvailability();
        }

        private void AboutClick(object sender, RoutedEventArgs e)
        {
            AboutDialog dlg = new AboutDialog();
            dlg.ShowDialog();
            /*
            About about = new About
                {
                    Publisher = "Espen Gätzschmann",
                    Title = "Rogue Trader Generator Tool",
                    AdditionalNotes =
                        "Rogue Trader and its respective trademarks are owned by Fantasy Flight Games and Games Workshop. I have no affiliation with either. This tool is provided free of charge, and I have been very careful not to break any copyrights. ",
                    Hyperlink = new Uri("mailto:espeng@gmail.com"),
                    HyperlinkText = "mailto:espeng@gmail.com",
                    ApplicationLogo = new BitmapImage(new Uri("pack://application:,,,/d6_128x128.ico"))
                };
            about.Show();
            */
        }

        private void WindowClosed(object sender, EventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void UpdateMenuItemAvailability()
        {
            GenerateNewSystemMenuItem.IsEnabled = Properties.Settings.Default.BookStarsOfInequity;
            GenerateNewPrimitiveSpeciesMenuItem.IsEnabled = Properties.Settings.Default.BookKoronusBestiary;
            GenerateNewTreasureMenuItem.IsEnabled = Properties.Settings.Default.BookStarsOfInequity;

            if (Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration ||
                Properties.Settings.Default.UseStarsOfInequityForXenosGeneration)
                GenerateNewXenosMenuItem.IsEnabled = true;
            else
                GenerateNewXenosMenuItem.IsEnabled = false;
        }

        private void AddXenosClick(object sender, RoutedEventArgs e)
        {
            var node = GetSelectedNode() as NativeSpeciesNode;
            if (node != null)
            {
                PlanetNode planet = node.Parent as PlanetNode;
                if(planet != null)
                {
                    XenosNode xenos = new XenosNode(planet.WorldType, false, node.SystemCreationRules) {Parent = node};
                    node.Children.Add(xenos);
                    xenos.Generate();
                    node.Dirty = true;
                }
            }
        }

        private void MoveUp(NodeBase node)
        {
            if (node == null || !IsEditableNode(node))
                return;

            if(node.Parent != null)
            {
                int oldIndex = node.Parent.Children.IndexOf(node);
                if(oldIndex > 0)
                {
                    node.Parent.Children.Remove(node);
                    node.Parent.Children.Insert(oldIndex - 1, node);
                    node.Parent.Dirty = true;
                }
            }
            else
            {
                int oldIndex = _rootNodes.IndexOf(node);
                if (oldIndex > 0)
                {
                    _rootNodes.Remove(node);
                    _rootNodes.Insert(oldIndex - 1, node);
                    _dirty = true;
                }
            }
            GenerateNames();
            SetSelected(TreeNodes, node);
        }

        private void MoveDown(NodeBase node)
        {
            if (node == null || !IsEditableNode(node))
                return;

            if (node.Parent != null)
            {
                int oldIndex = node.Parent.Children.IndexOf(node);
                if (oldIndex + 1 < node.Parent.Children.Count)
                {
                    node.Parent.Children.Remove(node);
                    node.Parent.Children.Insert(oldIndex + 1, node);
                    node.Parent.Dirty = true;
                }
            }
            else
            {
                int oldIndex = _rootNodes.IndexOf(node);
                if (oldIndex + 1 < _rootNodes.Count)
                {
                    _rootNodes.Remove(node);
                    _rootNodes.Insert(oldIndex + 1, node);
                    _dirty = true;
                }
            }
            GenerateNames();
            SetSelected(TreeNodes, node);
        }


        private void MoveUpClick(object sender, RoutedEventArgs e)
        {
            NodeBase node = GetSelectedNode();
            if (node != null)
                MoveUp(node);
        }

        private void MoveDownClick(object sender, RoutedEventArgs e)
        {
            NodeBase node = GetSelectedNode();
            if (node != null)
                MoveDown(node);
        }

        static private bool SetSelected(ItemsControl parent, object child)
        {
            if (parent == null || child == null)
                return false;

            TreeViewItem childNode = parent.ItemContainerGenerator.ContainerFromItem(child) as TreeViewItem;
            if (childNode != null)
            {
                childNode.Focus();
                return childNode.IsSelected = true;
            }

            if (parent.Items.Count > 0)
            {
                foreach (object childItem in parent.Items)
                {
                    ItemsControl childControl = parent.ItemContainerGenerator.ContainerFromItem(childItem) as ItemsControl;
                    if (SetSelected(childControl, child))
                        return true;
                }
            }
            return false;
        }

        private void MoveUpExecuted(object sender, ExecutedRoutedEventArgs e)
        {
            NodeBase node = GetSelectedNode();
            if(node != null)
                MoveUp(node);
        }

        private void MoveDownExecuted(object sender, ExecutedRoutedEventArgs e)
        {
            NodeBase node = GetSelectedNode();
            if (node != null)
                MoveDown(node);
        }

        private bool IsEditableNode(NodeBase node)
        {
            if (node is NativeSpeciesNode ||
                node is OrbitalFeaturesNode ||
                node is PirateShipsNode ||
                node is PrimitiveXenosNode ||
                node is ZoneNode)
                return false;
            return true;
        }

        private void AddPirateShipClick(object sender, RoutedEventArgs e)
        {
            var node = GetSelectedNode() as PirateShipsNode;
            if (node != null)
            {
                node.AddNewShip();
                node.Dirty = true;
            }
        }


    }
}
