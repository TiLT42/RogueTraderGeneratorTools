using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Windows;
using System.Windows.Documents;
using System.Windows.Media;

namespace RogueTraderSystemGenerator
{
    [DataContract]
    public struct DocContentItem
    {
        [DataMember]
        public string Content;
        [DataMember]
        public int PageNumber;
        [DataMember]
        public string RuleName;
        [DataMember]
        public string BookSource;
        [DataMember]
        public Paragraph AdvancedContent;

        public DocContentItem(string content, int pageNumber = 0, string ruleName = "", RuleBook book = RuleBook.StarsOfInequity)
        {
            Content = content;
            PageNumber = pageNumber;
            RuleName = ruleName;
            AdvancedContent = null;
            BookSource = "";
            SetBookSource(book);
        }

        public DocContentItem(Paragraph advancedContent, int pageNumber = 0, string ruleName = "", RuleBook book = RuleBook.StarsOfInequity)
        {
            Content = "";
            PageNumber = pageNumber;
            RuleName = ruleName;
            AdvancedContent = advancedContent;
            BookSource = "";
            SetBookSource(book);
        }

        private void SetBookSource(RuleBook book)
        {
            switch (book)
            {
                case RuleBook.CoreRuleBook:
                    BookSource = "Rogue Trader Core Rulebook";
                    break;
                case RuleBook.StarsOfInequity:
                    BookSource = "Stars of Inequity";
                    break;
                case RuleBook.BattlefleetKoronus:
                    BookSource = "Battlefleet Koronus";
                    break;
                case RuleBook.TheKoronusBestiary:
                    BookSource = "The Koronus Bestiary";
                    break;
                case RuleBook.IntoTheStorm:
                    BookSource = "Into the Storm";
                    break;
                case RuleBook.TheSoulReaver:
                    BookSource = "The Soul Reaver";
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(book));
            }
        }
    }

    static class DocBuilder
    {
        public static void AddHeader(ref FlowDocument doc, string header, int headerLevel)
        {
            Paragraph paragraph = new Paragraph();
            if (headerLevel <= 1)
            {
                paragraph.FontSize = 26;
                paragraph.FontWeight = FontWeights.Bold;
                paragraph.TextDecorations = TextDecorations.Underline;
                paragraph.Background = new LinearGradientBrush(Colors.LightGray, Colors.White, 0.0);
            }
            else if(headerLevel == 2)
            {
                paragraph.FontSize = 20;
                paragraph.FontWeight = FontWeights.Bold;
                paragraph.TextDecorations = TextDecorations.Underline;
                paragraph.Background = new LinearGradientBrush(Colors.LightGray, Colors.White, 0.0);
            }
            else if(headerLevel == 3)
            {
                paragraph.FontSize = 16;
                paragraph.FontWeight = FontWeights.Bold;
            }
            else if (headerLevel == 4)
            {
                paragraph.FontSize = 14;
                paragraph.FontWeight = FontWeights.Bold;
                paragraph.TextDecorations = TextDecorations.Underline;
            }
            else 
            {
                paragraph.FontSize = 14;
                paragraph.FontWeight = FontWeights.Bold;
            }
            paragraph.Inlines.Add(new Run(header));
            doc.Blocks.Add(paragraph);
        }
    
        public static void AddContentLine(ref FlowDocument doc, string header, DocContentItem content)
        {
            Paragraph paragraph = new Paragraph {FontSize = 12};
            if(header.Trim().Length > 0)
                paragraph.Inlines.Add(new Bold(new Run(header + ": ")));
            if (content.AdvancedContent != null)
            {
                foreach (var inline in content.AdvancedContent.Inlines)
                {
                    paragraph.Inlines.Add(inline);
                }
            }
            else
                paragraph.Inlines.Add(new Run(content.Content));
            if (Properties.Settings.Default.ShowPageNumbers && content.RuleName.Trim().Length > 0 && content.PageNumber > 0)
                paragraph.Inlines.Add(new Italic(new Run("  (" + content.RuleName + ", page " + content.PageNumber + " - " + content.BookSource + ")")));
            else if (Properties.Settings.Default.ShowPageNumbers && content.PageNumber > 0)
                paragraph.Inlines.Add(new Italic(new Run("  (page " + content.PageNumber + " - " + content.BookSource + ")")));
            doc.Blocks.Add(paragraph);
        }

        public static void AddContentList(ref FlowDocument doc, string header, List<DocContentItem> content)
        {
            Paragraph paraHeader = new Paragraph {FontSize = 12};
            paraHeader.Inlines.Add(new Bold(new Run(header + ":")));
            doc.Blocks.Add(paraHeader);

            List contentList = new List();
            foreach (DocContentItem item in content)
            {
                Paragraph paragraph = item.AdvancedContent ?? new Paragraph(new Run(item.Content));
                if (Properties.Settings.Default.ShowPageNumbers && item.RuleName.Trim().Length > 0 && item.PageNumber > 0)
                    paragraph.Inlines.Add(new Italic(new Run("  (" + item.RuleName + ", page " + item.PageNumber + " - " + item.BookSource + ")")));
                else if (Properties.Settings.Default.ShowPageNumbers && item.PageNumber > 0)
                    paragraph.Inlines.Add(new Italic(new Run("  (page " + item.PageNumber + " - " + item.BookSource + ")")));
                paragraph.FontSize = 12;
                contentList.ListItems.Add(new ListItem(paragraph));
            }
            doc.Blocks.Add(contentList);
        }


    }
}
