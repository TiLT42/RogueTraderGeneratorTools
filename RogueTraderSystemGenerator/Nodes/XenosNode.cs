using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.Windows;
using System.Windows.Documents;
using System.Windows.Media;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class XenosNode :  NodeBase
    {
        //private string _xenoName = "Unknown Creature";
        [DataMember]
        private XenosBase _xenos;

        [DataMember]
        public WorldType WorldType { get; set; }
        [DataMember]
        public bool IsPrimitiveXenos { get; set; }

        public XenosNode(WorldType worldType, bool isPrimitiveXenos, SystemCreationRules systemCreationRules)
        {
            _systemCreationRules = systemCreationRules;
            _nodeName = "Xeno Creature";
            WorldType = worldType;
            IsPrimitiveXenos = isPrimitiveXenos;
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            _xenos = null;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            //_flowDocument.IsColumnWidthFlexible = false;

            // Create stat block
            Table table = new Table();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 5);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));

            _flowDocument.Blocks.Add(table);
            const int numColumns = 9;
            for (int i = 0; i < numColumns; i++)
            {
                TableColumn column = new TableColumn {Width = GridLength.Auto};
                //column.Width = new GridLength(35);
                table.Columns.Add(column);
            }
            table.CellSpacing = 0;

            table.RowGroups.Add(new TableRowGroup());
            table.RowGroups[0].Rows.Add(new TableRow());
            TableRow currentRow = table.RowGroups[0].Rows[0];
            currentRow.FontSize = 12;
            currentRow.FontWeight = FontWeights.Bold;

            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(NodeName))));
            currentRow.Cells[0].ColumnSpan = numColumns;
            currentRow.Cells[0].BorderBrush = Brushes.Black;
            currentRow.Cells[0].BorderThickness = new Thickness(1);
            currentRow.Cells[0].Padding = new Thickness(2);

            table.RowGroups[0].Rows.Add(new TableRow());
            currentRow = table.RowGroups[0].Rows[1];

            currentRow.FontSize = 12;
            currentRow.FontWeight = FontWeights.Bold;

            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("WS"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("BS"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("S"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("T"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("Ag"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("Int"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("Per"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("WP"))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run("Fel"))));
            for(int i = 0; i < numColumns; i++)
            {
                currentRow.Cells[i].TextAlignment = TextAlignment.Center;
                currentRow.Cells[i].BorderBrush = Brushes.Black;
                currentRow.Cells[i].BorderThickness = new Thickness(1);
                currentRow.Cells[i].Padding = new Thickness(2);
            }

            table.RowGroups[0].Rows.Add(new TableRow());
            currentRow = table.RowGroups[0].Rows[2];

            currentRow.FontSize = 9;
            //currentRow.FontWeight = FontWeights.Bold;

            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(""))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(""))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.GetUnnaturalStrengthTextForTable()))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.GetUnnaturalToughnessTextForTable()))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(""))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(""))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(""))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(""))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(""))));
            for (int i = 0; i < numColumns; i++)
            {
                currentRow.Cells[i].TextAlignment = TextAlignment.Left;
                currentRow.Cells[i].BorderBrush = Brushes.Black;
                currentRow.Cells[i].BorderThickness = new Thickness(1, 1, 1, 0);
                currentRow.Cells[i].Padding = new Thickness(2, 0, 0, 2);
            }

            table.RowGroups[0].Rows.Add(new TableRow());
            currentRow = table.RowGroups[0].Rows[3];

            currentRow.FontSize = 14;
            //currentRow.FontWeight = FontWeights.Bold;

            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.WeaponSkill)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.BallisticSkill)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.Strength)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.Toughness)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.Agility)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.Intelligence)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.Perception)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.WillPower)))));
            currentRow.Cells.Add(new TableCell(new Paragraph(new Run(_xenos.Stats.GetStatTextForTable(_xenos.Stats.Fellowship)))));
            for (int i = 0; i < numColumns; i++)
            {
                currentRow.Cells[i].TextAlignment = TextAlignment.Center;
                currentRow.Cells[i].BorderBrush = Brushes.Black;
                currentRow.Cells[i].BorderThickness = new Thickness(1, 0, 1, 1);
                currentRow.Cells[i].Padding = new Thickness(2, 0, 2, 2);
            }

            table.RowGroups[0].Rows.Add(new TableRow());
            currentRow = table.RowGroups[0].Rows[4];

            Paragraph paragraph = new Paragraph {FontSize = 12};
            paragraph.Inlines.Add(new Bold(new Run("Movement: ")));
            paragraph.Inlines.Add(new Run(_xenos.GetMovementString()));
            currentRow.Cells.Add(new TableCell(paragraph));
            currentRow.Cells[0].ColumnSpan = 6;
            currentRow.Cells[0].Padding = new Thickness(2, 10, 2, 3);

            paragraph = new Paragraph {FontSize = 12};
            paragraph.Inlines.Add(new Bold(new Run("Wounds: ")));
            paragraph.Inlines.Add(new Run(_xenos.Wounds.ToString(CultureInfo.InvariantCulture)));
            currentRow.Cells.Add(new TableCell(paragraph));
            currentRow.Cells[1].ColumnSpan = 3;
            currentRow.Cells[1].TextAlignment = TextAlignment.Right;
            currentRow.Cells[1].Padding = new Thickness(2, 10, 2, 3);

            table.RowGroups[0].Rows.Add(new TableRow());
            currentRow = table.RowGroups[0].Rows[5];

            paragraph = new Paragraph {FontSize = 12};
            paragraph.Inlines.Add(new Bold(new Run("Armour: ")));
            paragraph.Inlines.Add(new Run(_xenos.GetArmourText(_xenos is XenosPrimitive)));
            currentRow.Cells.Add(new TableCell(paragraph));
            currentRow.Cells[0].ColumnSpan = 6;
            currentRow.Cells[0].Padding = new Thickness(2, 3, 2, 0);

            paragraph = new Paragraph {FontSize = 12};
            paragraph.Inlines.Add(new Bold(new Run("Total TB: ")));
            paragraph.Inlines.Add(new Run(_xenos.GetTotalToughnessBonus().ToString(CultureInfo.InvariantCulture)));
            currentRow.Cells.Add(new TableCell(paragraph));
            currentRow.Cells[1].ColumnSpan = 3;
            currentRow.Cells[1].TextAlignment = TextAlignment.Right;
            currentRow.Cells[1].Padding = new Thickness(2, 3, 2, 0);

            // END generate table

            if (_xenos is XenosStarsOfInequity)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Bestial Archetype", (_xenos as XenosStarsOfInequity).BestialArchetypeText);
                DocBuilder.AddContentLine(ref _flowDocument, "Bestial Nature", (_xenos as XenosStarsOfInequity).BestialNature);
            }
            if(_xenos is XenosKoronusBestiary)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Base Profile", (_xenos as XenosKoronusBestiary).BaseProfileText);
                if((_xenos as XenosKoronusBestiary).FloraType != FloraType.NotFlora)
                    DocBuilder.AddContentLine(ref _flowDocument, "Flora Type", (_xenos as XenosKoronusBestiary).FloraTypeText);
            }
            if (_xenos is XenosPrimitive)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Unusual Xenos Communication", (_xenos as XenosPrimitive).UnusualCommunication);
                DocBuilder.AddContentLine(ref _flowDocument, "Social Structure", (_xenos as XenosPrimitive).SocialStructure);
            }

            DocBuilder.AddContentLine(ref _flowDocument, "Skills", new DocContentItem(_xenos.GetSkillList()));
            DocBuilder.AddContentLine(ref _flowDocument, "Talents", new DocContentItem(_xenos.GetTalentList()));
            if (Properties.Settings.Default.ShowPageNumbers)
                DocBuilder.AddContentList(ref _flowDocument, "Traits", _xenos.Traits.GetTraitListDocContentItems());
            else
                DocBuilder.AddContentLine(ref _flowDocument, "Traits", new DocContentItem(_xenos.GetTraitList()));
            DocBuilder.AddContentLine(ref _flowDocument, "Weapons", new DocContentItem(_xenos.GetWeaponList()));
        }

        public override void Generate()
        {
            if (IsPrimitiveXenos)
            {
                GeneratePrimitiveXenos();
            }
            else
            {
                if (Properties.Settings.Default.UseStarsOfInequityForXenosGeneration && !Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration)
                    GenerateStarsOfInequityXenos();
                else if (!Properties.Settings.Default.UseStarsOfInequityForXenosGeneration && Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration)
                    GenerateKoronusBestiaryXenos();
                else if (Properties.Settings.Default.UseStarsOfInequityForXenosGeneration && Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration)
                {
                    if (Globals.RollD10() <= 3)
                        GenerateStarsOfInequityXenos();
                    else
                        GenerateKoronusBestiaryXenos();
                }
            }
            GenerateFlowDocument();
        }

        private void GenerateStarsOfInequityXenos()
        {
            _xenos = new XenosStarsOfInequity();
            (_xenos as XenosStarsOfInequity).Generate();
            NodeName = (_xenos as XenosStarsOfInequity).BestialArchetypeText.Content;
        }

        private void GenerateKoronusBestiaryXenos()
        {
            _xenos = new XenosKoronusBestiary(WorldType);
            (_xenos as XenosKoronusBestiary).Generate();
            NodeName = (_xenos as XenosKoronusBestiary).BaseProfileText.Content;
        }

        private void GeneratePrimitiveXenos()
        {
            _xenos = new XenosPrimitive();
            (_xenos as XenosPrimitive).Generate();
            NodeName = "Primitive Xenos";
        }

    }
}
