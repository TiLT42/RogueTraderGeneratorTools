using System.Windows;
using System.Windows.Controls;

namespace RogueTraderSystemGenerator
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            EventManager.RegisterClassHandler(typeof(TreeViewItem), UIElement.PreviewMouseRightButtonDownEvent, new RoutedEventHandler(TreeViewItem_PreviewMouseRightButtonDownEvent));

            base.OnStartup(e);
        }

        private void TreeViewItem_PreviewMouseRightButtonDownEvent(object sender, RoutedEventArgs e)
        {
            var treeViewItem = sender as TreeViewItem;
            if (treeViewItem != null)
                treeViewItem.IsSelected = true;
        }
    }
}
