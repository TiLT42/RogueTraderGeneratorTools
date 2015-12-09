using System.Windows;

namespace RogueTraderSystemGenerator
{
    /// <summary>
    /// Interaction logic for SettingsWindow.xaml
    /// </summary>
    public partial class SettingsWindow
    {
        private bool _isHandlingCheckedToggle;

        public SettingsWindow()
        {
            InitializeComponent();

            StarsOfInequityCheckBox.IsChecked = Properties.Settings.Default.BookStarsOfInequity;
            TheKoronusBestiaryCheckBox.IsChecked = Properties.Settings.Default.BookKoronusBestiary;
            IntoTheStormCheckBox.IsChecked = Properties.Settings.Default.BookIntoTheStorm;
            BattlefleetKoronusCheckBox.IsChecked = Properties.Settings.Default.BookBattlefleetKoronus;
            TheSoulReaverCheckBox.IsChecked = Properties.Settings.Default.BookTheSoulReaver;

            XenosGeneratorSoiCheckBox.IsChecked = Properties.Settings.Default.UseStarsOfInequityForXenosGeneration;
            XenosGeneratorKbCheckBox.IsChecked = Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration;
        }

        private void ButtonClick(object sender, RoutedEventArgs e)
        {
            Close();
        }


        private void HandleToggledCheckbox()
        {
            _isHandlingCheckedToggle = true;
            if (StarsOfInequityCheckBox.IsChecked == true)
            {
                XenosGeneratorSoiCheckBox.IsEnabled = true;
            }
            else
            {
                XenosGeneratorSoiCheckBox.IsEnabled = false;
                XenosGeneratorSoiCheckBox.IsChecked = false;
            }
            if(TheKoronusBestiaryCheckBox.IsChecked == true)
            {
                XenosGeneratorKbCheckBox.IsEnabled = true;
            }
            else
            {
                XenosGeneratorKbCheckBox.IsEnabled = false;
                XenosGeneratorKbCheckBox.IsChecked = false;
            }
            _isHandlingCheckedToggle = false;
        }

        private void AnyCheckBoxChecked(object sender, RoutedEventArgs e)
        {
            if (!_isHandlingCheckedToggle)
                HandleToggledCheckbox();
        }

        private void AnyCheckBoxUnchecked(object sender, RoutedEventArgs e)
        {
            if (!_isHandlingCheckedToggle)
                HandleToggledCheckbox();
        }

        private void WindowClosing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (StarsOfInequityCheckBox.IsChecked != null) Properties.Settings.Default.BookStarsOfInequity = (bool) StarsOfInequityCheckBox.IsChecked;
            if (TheKoronusBestiaryCheckBox.IsChecked != null) Properties.Settings.Default.BookKoronusBestiary = (bool)TheKoronusBestiaryCheckBox.IsChecked;
            if (IntoTheStormCheckBox.IsChecked != null) Properties.Settings.Default.BookIntoTheStorm = (bool)IntoTheStormCheckBox.IsChecked;
            if (BattlefleetKoronusCheckBox.IsChecked != null) Properties.Settings.Default.BookBattlefleetKoronus = (bool)BattlefleetKoronusCheckBox.IsChecked;
            if (TheSoulReaverCheckBox.IsChecked != null) Properties.Settings.Default.BookTheSoulReaver = (bool)TheSoulReaverCheckBox.IsChecked;

            if (XenosGeneratorSoiCheckBox.IsChecked != null) Properties.Settings.Default.UseStarsOfInequityForXenosGeneration = (bool)XenosGeneratorSoiCheckBox.IsChecked;
            if (XenosGeneratorKbCheckBox.IsChecked != null) Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration = (bool)XenosGeneratorKbCheckBox.IsChecked;
        }
    }
}
