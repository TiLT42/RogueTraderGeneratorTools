using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace RogueTraderSystemGenerator
{
    /// <summary>
    /// Interaction logic for InputDialog.xaml
    /// </summary>
    public partial class InputDialog
    {
        public InputDialog()
        {
            InitializeComponent();
            UserInput.Focus();
        }

        private void OkButtonClick(object sender, RoutedEventArgs e)
        {
            if (UserInput.Text.Trim().Length > 0)
            {
                DialogResult = true;
                Close();
            }
        }

        private void CancelButtonClick(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }

        private void UserInputTextChanged(object sender, TextChangedEventArgs e)
        {
            OkButton.IsEnabled = UserInput.Text.Trim().Length > 0;
        }

        private void UserInputKeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                OkButtonClick(this, new RoutedEventArgs());
            }
            if (e.Key == Key.Escape)
            {
                CancelButtonClick(this, new RoutedEventArgs());
            }

        }
    }
}