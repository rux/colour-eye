/*

+-----------------------------------------------------------------+
|   Created by Chirag Mehta - http://chir.ag/tech/download/ntc    |
|-----------------------------------------------------------------|
|               ntc js (Name that Color JavaScript)               |
+-----------------------------------------------------------------+

All the functions, code, lists etc. have been written specifically
for the Name that Color JavaScript by Chirag Mehta unless otherwise
specified.

This script is released under the: Creative Commons License:
Attribution 2.5 http://creativecommons.org/licenses/by/2.5/

Sample Usage:

  <script type="text/javascript" src="ntc.js"></script>

  <script type="text/javascript">

    var n_match  = ntc.name("#6195ED");
    n_rgb = n_match[0]; // This is the RGB value of the closest matching color
    n_name = n_match[1]; // This is the text string for the name of the match
    n_shade_rgb = n_match[2]; // This is the RGB value for the name of colors shade
    n_shade_name = n_match[3]; // This is the text string for the name of colors shade
    n_exactmatch = n_match[4]; // True if exact color match, False if close-match

    alert(n_match);

  </script>

*/

var ntc = {

  init: function() {
    var color, rgb, hsl;

    for(var i = 0; i < ntc.names.length; i++)
    {
      color = "#" + ntc.names[i][0];
      rgb = ntc.rgb(color);
      hsl = ntc.hsl(color);
      ntc.names[i].push(rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2]);
    }
  },

  name: function(color) {

    color = color.toUpperCase();
    if(color.length < 3 || color.length > 7)
      return ["#000000", "Invalid Color: " + color, "#000000", "", false];
    if(color.length % 3 == 0)
      color = "#" + color;
    if(color.length == 4)
      color = "#" + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);

    var rgb = ntc.rgb(color);
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var hsl = ntc.hsl(color);
    var h = hsl[0], s = hsl[1], l = hsl[2];
    var ndf1 = 0; ndf2 = 0; ndf = 0;
    var cl = -1, df = -1;

    for(var i = 0; i < ntc.names.length; i++)
    {
      if(color == "#" + ntc.names[i][0])
        return ["#" + ntc.names[i][0], ntc.names[i][1], ntc.shadergb(ntc.names[i][2]), ntc.names[i][2], true];

      ndf1 = Math.pow(r - ntc.names[i][3], 2) + Math.pow(g - ntc.names[i][4], 2) + Math.pow(b - ntc.names[i][5], 2);
      ndf2 = Math.abs(Math.pow(h - ntc.names[i][6], 2)) + Math.pow(s - ntc.names[i][7], 2) + Math.abs(Math.pow(l - ntc.names[i][8], 2));
      ndf = ndf1 + ndf2 * 2;
      if(df < 0 || df > ndf)
      {
        df = ndf;
        cl = i;
      }
    }

    return (cl < 0 ? ["#000000", "Invalid Color: " + color, "#000000", "", false] : ["#" + ntc.names[cl][0], ntc.names[cl][1], ntc.shadergb(ntc.names[cl][2]), ntc.names[cl][2], false]);
  },

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  hsl: function (color) {

    var rgb = [parseInt('0x' + color.substring(1, 3)) / 255, parseInt('0x' + color.substring(3, 5)) / 255, parseInt('0x' + color.substring(5, 7)) / 255];
    var min, max, delta, h, s, l;
    var r = rgb[0], g = rgb[1], b = rgb[2];

    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;

    s = 0;
    if(l > 0 && l < 1)
      s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));

    h = 0;
    if(delta > 0)
    {
      if (max == r && max != g) h += (g - b) / delta;
      if (max == g && max != b) h += (2 + (b - r) / delta);
      if (max == b && max != r) h += (4 + (r - g) / delta);
      h /= 6;
    }
    return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
  },

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  rgb: function(color) {
    return [parseInt('0x' + color.substring(1, 3)), parseInt('0x' + color.substring(3, 5)),  parseInt('0x' + color.substring(5, 7))];
  },
  
  shadergb: function (shadename) {
    for(var i = 0; i < ntc.shades.length; i++) {
      if(shadename == ntc.shades[i][1])
        return "#" + ntc.shades[i][0];
    }
    return "#000000";
  },

  shade: [
"Rouge",
"Orange",
"Jaune",
"Vert",
"Bleu",
"Violet",
"Brun",
"Noir",
"Gris",
"Blanc"
],
  shades: [
 ["FF0000", "Rouge"],
["FFA500", "Orange"],
["FFFF00", "Jaune"],
["008000", "Vert"],
["0000FF", "Bleu"],
["EE82EE", "Violet"],
["A52A2A", "Brun"],
["000000", "Noir"],
["808080", "Gris"],
["FFFFFF", "Blanc"]
],



  names: [
["6C0277", "Zinzolin", "Violet"],
["40826D", "Viride", "Bleu"],
["A10684", "Violine", "Violet"],
["723E64", "Violet d'évÃªque", "Violet"],
["682145", "Violet de Bayeux", "Violet"],
["660099", "Violet", "Violet"],
["5A6521", "Vert Véronèse (pigment)", "Vert"],
["1FFED8", "Vert turquoise", "Bleu"],
["A5D152", "Vert tilleul", "Vert"],
["689D71", "Vert sauge", "Vert"],
["095228", "Vert sapin", "Vert"],
["00FF7F", "Vert printemps", "Vert"],
["57D53B", "Vert prairie", "Vert"],
["34C924", "Vert pomme", "Vert"],
["4CA66B", "Vert poireau ou prasin", "Vert"],
["BEF574", "Vert pistache", "Vert"],
["01796F", "Vert pin", "Vert"],
["3AF24B", "Vert perroquet", "Vert"],
["97DFC6", "Vert opaline", "Vert"],
["708D23", "Vert olive", "Vert"],
["679F5A", "Vert mousse", "Vert"],
["596643", "Vert militaire", "Vert"],
["54F98D", "Vert menthe Ã  l'eau", "Vert"],
["16B84E", "Vert menthe", "Vert"],
["386F48", "Vert mélèze", "Vert"],
["1FA055", "Vert malachite", "Vert"],
["9EFD38", "Vert lime", "Vert"],
["85C17E", "Vert lichen", "Vert"],
["798933", "Vert kaki", "Vert"],
["87E990", "Vert jade", "Vert"],
["00561B", "Vert impérial", "Vert"],
["3A9D23", "Vert gazon ou herbe", "Vert"],
["175732", "Vert épinard", "Vert"],
["01D758", "Vert émeraude ou Smaragdin", "Vert"],
["22780F", "Vert de vessie", "Vert"],
["1B4F08", "Vert de Hooker", "Vert"],
["95A595", "Vert-de-gris", "Vert"],
["18391E", "Vert de chrome ou anglais (pigment)", "Vert"],
["B0F2B6", "Vert d'eau", "Vert"],
["C2F732", "Vert chartreuse", "Vert"],
["83A697", "Vert céladon", "Vert"],
["096A09", "Vert bouteille", "Vert"],
["568203", "Vert avocat", "Vert"],
["9FE855", "Vert anis", "Vert"],
["82C46C", "Vert amande", "Vert"],
["00FF00", "Vert secondaire", "Vert"],
["7FDD4C", "Vert absinthe", "Vert"],
["DB1702", "Vermillon", "Rouge"],
["FF0921", "Vermeil", "Rouge"],
["E9C9B1", "Ventre de biche", "Brun"],
["E1CE9A", "Vanille", "Jaune"],
["25FDE9", "Turquoise", "Bleu"],
["BBACAC", "Tourterelle", "Gris"],
["FAEA73", "Topaze", "Vert"],
["DE2916", "Tomate", "Orange"],
["4E1609", "Tilleuil", "Brun"],
["E97451", "Terre de Sienne brÃ»lée", "Brun"],
["8A3324", "Terre de Sienne", "Brun"],
["926D27", "Terre d'ombre", "Jaune"],
["463F32", "Taupe", "Gris"],
["A75502", "Tanné (héraldique)", "Orange"],
["FF7F00", "Tangerine (couleur)", "Orange"],
["9F551E", "Tabac", "Orange"],
["9E9E9E", "Souris", "Gris"],
["FFFF6B", "Soufre", "Jaune"],
["01D758", "Smaragdin", "Vert"],
["003399", "Smalt", "Bleu"],
["149414", "Sinople (héraldique)", "Vert"],
["AE8964", "Sépia", "Brun"],
["8D4024", "Senois (héraldique)", "Brun"],
["F88E55", "Saumon", "Orange"],
["008E8E", "Sarcelle", "Vert"],
["0131B4", "Saphir", "Bleu"],
["850606", "Sanguine (héraldique)", "Rouge"],
["730800", "Sang de bÅ“uf", "Brun"],
["0131B4", "Safre", "Bleu"],
["F3D617", "Safran", "Jaune"],
["000000", "Sable (héraldique)", "Noir"],
["E0CDA9", "Sable", "Jaune"],
["E0115F", "Rubis", "Rouge"],
["AD4F09", "Roux", "Rouge"],
["985717", "Rouille", "Brun"],
["DB1702", "Rouge vermillon", "Rouge"],
["A91101", "Rouge turc", "Rouge"],
["AE4A34", "Rouge tomette", "Rouge"],
["DE2916", "Rouge tomate", "Orange"],
["850606", "Rouge sang", "Rouge"],
["C60800", "Rouge ponceau", "Rouge"],
["C71585", "Rouge-violet", "Rouge"],
["CF0A1D", "Rouge groseille", "Rouge"],
["920017", "Rouge Sokai", "Rouge"],
["6E0B14", "Rouge grenat", "Rouge"],
["E9383F", "Rouge grenadine", "Rouge"],
["C72C48", "Rouge framboise", "Rouge"],
["BF3030", "Rouge fraise", "Brun"],
["FE1B00", "Rouge feu", "Rouge"],
["BC2001", "Rouge écrevisse", "Rouge"],
["F7230C", "Rouge de Mars (pigment)", "Rouge"],
["801818", "Rouge de Falun", "Rouge"],
["ED0000", "Rouge d'aniline", "Rouge"],
["A91101", "Rouge d'Andrinople", "Rouge"],
["E32636", "Rouge d'alizarine (pigment)", "Rouge"],
["C60800", "Rouge coquelicot", "Rouge"],
["DB1702", "Rouge cinabre", "Rouge"],
["BB0B0B", "Rouge cerise", "Rouge"],
["960018", "Rouge carmin", "Rouge"],
["B82010", "Rouge cardinal", "Orange"],
["FF5E4D", "Rouge capucine", "Rouge"],
["6B0D0D", "Rouge bourgogne", "Rouge"],
["6D071A", "Rouge bordeaux", "Rouge"],
["A5260A", "Rouge Bismarck", "Rouge"],
["F7230C", "Rouge anglais", "Rouge"],
["FF0000", "Rouge primaire", "Rouge"],
["FF007F", "Rose vif", "Rouge"],
["FF866A", "Rose thé", "Orange"],
["997A8D", "Rose Mountbatten", "Violet"],
["FD3F92", "Rose fuchsia", "Rouge"],
["FEBFD2", "Rose dragée", "Rouge"],
["F9429E", "Rose bonbon", "Rouge"],
["C4698F", "Rose balais (minéraux)", "Violet"],
["FD6C9E", "Rose", "Rouge"],
["2D241E", "Réglisse", "Brun"],
["A89874", "Queue-de-vache foncé", "Jaune"],
["C3B470", "Queue-de-vache clair", "Jaune"],
["91283B", "Queue-de-renard", "Rouge"],
["4E1609", "Puce", "Brun"],
["811453", "Prune", "Violet"],
["4CA66B", "Prasin", "Vert"],
["9E0E40", "Pourpre (héraldique)", "Rouge"],
["C60800", "Ponceau", "Rouge"],
["B67823", "Poil de chameau", "Jaune"],
["798081", "Plomb", "Bleu"],
["FAF0C5", "Platine", "Vert"],
["BEF574", "Pistache", "Vert"],
["CCCCCC", "Pinchard (chevaux vieilli)", "Gris"],
["CCCCFF", "Pervenche", "Bleu"],
["D58490", "Pelure d'oignon (Å“nologie)", "Rouge"],
["FDBFB7", "PÃªche", "Rouge"],
["56739A", "Pastel", "Bleu"],
["91283B", "Passe-velours", "Rouge"],
["CFA0E9", "Parme", "Violet"],
["EDD38C", "Papier bulle", "Jaune"],
["FFEFD5", "Papaye", "Jaune"],
["FEE347", "Paille", "Vert"],
["292107", "Oscuro (cigare)", "Brun"],
["FCD21C", "Orpin de Perse", "Jaune"],
["FCD21C", "Orpiment", "Jaune"],
["DA70D6", "Orchidée", "Violet"],
["CC5500", "Orange brÃ»lée", "Orange"],
["ED7F10", "Orange", "Orange"],
["FFD700", "Or", "Jaune"],
["F2FFFF", "Opalin", "Bleu"],
["708D23", "Olive", "Vert"],
["DD985C", "Ocre rouge", "Orange"],
["DFAF2C", "Ocre jaune", "Jaune"],
["955628", "Noisette", "Orange"],
["2F1E0E", "Noiraud (teint, cheveux)", "Brun"],
["000000", "Noir de jais", "Noir"],
["130E0A", "Noir de fumée (pigment)", "Brun"],
["130E0A", "Noir de carbone (pigment)", "Brun"],
["000000", "Noir d'ivoire (pigment)", "Noir"],
["000000", "Noir d'encre", "Noir"],
["120D16", "Noir d'aniline", "Violet"],
["000010", "Noir charbon", "Vert"],
["000000", "Noir animal", "Noir"],
["000000", "Noir", "Noir"],
["FEFEFE", "Neige", "Blanc"],
["F7E269", "Nankin", "Jaune"],
["FC5D5D", "Nacarat", "Orange"],
["C7CF00", "Moutarde", "Vert"],
["000000", "Moreau (chevaux)", "Noir"],
["87591A", "Mordoré", "Brun"],
["DAB30A", "Miel", "Jaune"],
["54F98D", "Menthe Ã  l'eau", "Vert"],
["16B84E", "Menthe", "Vert"],
["DE9816", "Melon", "Jaune"],
["D473D4", "Mauve", "Violet"],
["B3B191", "Mastic", "Vert"],
["582900", "Marron", "Brun"],
["03224C", "Marine", "Bleu"],
["FEA347", "Mandarine", "Jaune"],
["1FA055", "Malachite", "Vert"],
["FFDE75", "MaÃ¯s", "Jaune"],
["965578", "Mauve", "Rouge"],
["800080", "Magenta foncé", "Violet"],
["FF00FF", "Magenta secondaire", "Violet"],
["DB0073", "Magenta fuchsia (encre)", "Rouge"],
["5B3C11", "Maduro colorado (cigare)", "Brun"],
["372F25", "Maduro (cigare)", "Brun"],
["FAF0E6", "Lin", "Blanc"],
["B666D2", "Lilas", "Violet"],
["AC1E44", "Lie de vin", "Rouge"],
["9683EC", "Lavande", "Bleu"],
["8F5922", "Lavallière (reliure)", "Jaune"],
["26619C", "Lapis-lazuli", "Bleu"],
["94812B", "Kaki", "Jaune"],
["FFFF6B", "Jaune soufre", "Jaune"],
["F7E35F", "Jaune poussin", "Jaune"],
["FEE347", "Jaune paille", "Vert"],
["F7E269", "Jaune nankin", "Jaune"],
["C7CF00", "Jaune moutarde", "Vert"],
["FEF86C", "Jaune mimosa", "Jaune"],
["FFDE75", "Jaune maÃ¯s", "Jaune"],
["FFE436", "Jaune impérial", "Vert"],
["FFFF6B", "Jaune fleur de soufre", "Jaune"],
["FFF0BC", "Jaune de Naples (pigment)", "Jaune"],
["EED153", "Jaune de Mars", "Jaune"],
["EDFF0C", "Jaune chrome (pigment)", "Jaune"],
["EFD807", "Jaune d'or", "Jaune"],
["F7FF3C", "Jaune citron", "Vert"],
["DFFF00", "Jaune chartreuse", "Jaune"],
["E7F00D", "Jaune canari", "Jaune"],
["F6DC12", "Jaune bouton dâ€™or", "Jaune"],
["D1B606", "Jaune banane", "Vert"],
["FDEE00", "Jaune auréolin", "Jaune"],
["FFFF00", "Jaune primaire", "Jaune"],
["000000", "Jais", "Noir"],
["87E990", "Jade", "Vert"],
["FFFFD4", "Ivoire", "Blanc"],
["785E2F", "Isabelle (chevaux)", "Jaune"],
["2E006C", "Indigo (teinture)", "Violet"],
["6F00FF", "Indigo électrique", "Violet"],
["4B0082", "Indigo du web", "Violet"],
["791CF8", "Indigo chaud", "Violet"],
["FF6F7D", "Incarnat", "Rouge"],
["FE96A0", "Incarnadin", "Rouge"],
["000000", "Hoto", "Noir"],
["DF73FF", "Héliotrope", "Violet"],
["947F60", "Havane", "Brun"],
["E21313", "Gueules (héraldique)", "Rouge"],
["CF0A1D", "Groseille", "Rouge"],
["BBACAC", "Gris tourterelle", "Gris"],
["C1BFB1", "Gris tourdille (chevaux)", "Vert"],
["463F32", "Gris taupe", "Gris"],
["9E9E9E", "Gris souris", "Gris"],
["798081", "Gris plomb", "Bleu"],
["CECECE", "Gris perle", "Gris"],
["BBD2E1", "Gris fumée", "Bleu"],
["7F7F7F", "Gris fer", "Gris"],
["677179", "Gris de Payne", "Bleu"],
["685E43", "Gris de maure", "Gris"],
["D2CAEC", "Gris de lin", "Violet"],
["303030", "Gris anthracite", "Gris"],
["AFAFAF", "Gris acier", "Gris"],
["606060", "Gris", "Gris"],
["6E0B14", "Grenat", "Rouge"],
["E9383F", "Grenadine", "Rouge"],
["BBAE98", "Grège", "Jaune"],
["C9A0DC", "Glycine", "Violet"],
["649B88", "Glauque", "Vert"],
["EE1010", "Garance", "Rouge"],
["F400A1", "Fuchsia", "Rouge"],
["C72C48", "Framboise", "Rouge"],
["A42424", "Fraise écrasée", "Brun"],
["BF3030", "Fraise", "Brun"],
["FFFF6B", "Fleur de soufre", "Jaune"],
["E6E697", "Flave", "Vert"],
["99512B", "Feuille morte", "Orange"],
["FF4901", "Feu vif", "Rouge"],
["848484", "Fer", "Gris"],
["AD4F09", "Fauve", "Rouge"],
["EDEDED", "Étain pur", "Blanc"],
["BABABA", "Étain oxydé", "Gris"],
["01D758", "Émeraude", "Vert"],
["FEFEE0", "Écru", "Jaune"],
["ED0000", "Écarlate", "Rouge"],
["000000", "Ébène", "Noir"],
["0B1616", "Dium (IPJ)", "Vert"],
["1560BD", "Denim", "Bleu"],
["00FFFF", "Cyan secondaire", "Bleu"],
["2BFAFA", "Cyan", "Bleu"],
["B36700", "Cuivre", "Orange"],
["FF69B4", "Cuisse de nymphe émue", "Rouge"],
["FEE7F0", "Cuisse de nymphe", "Rouge"],
["FDF1B8", "Crème", "Jaune"],
["DC143C", "Cramoisi", "Rouge"],
["E73E01", "Corail", "Rouge"],
["FDE9E0", "Coquille d'Å“uf", "Rouge"],
["C60800", "Coquelicot", "Rouge"],
["6A4B21", "Colorado claro (cigare)", "Brun"],
["703516", "Colorado (cigare)", "Brun"],
["6A455D", "Colombin (vieilli)", "Violet"],
["BA9B61", "Claro claro (cigare)", "Jaune"],
["845A3B", "Claro (cigare)", "Brun"],
["B9B276", "Clarissimo (cigare)", "Vert"],
["DF6D14", "Citrouille", "Brun"],
["F7FF3C", "Citron", "Vert"],
["DB1702", "Cinabre", "Rouge"],
["5A3A22", "Chocolat", "Brun"],
["FEFEFE", "Chenu (cheveux)", "Blanc"],
["85530F", "Chaudron", "Brun"],
["8B6C42", "Châtain (cheveux)", "Brun"],
["806D5A", "Châtaigne", "Brun"],
["7FFF00", "Chartreuse", "Vert"],
["000010", "Charbonneux", "Vert"],
["FBF2B7", "Champagne", "Jaune"],
["D0C07A", "Chamois", "Jaune"],
["FEC3AC", "Chair", "Rouge"],
["FEFEFE", "Céruse (pigment)", "Blanc"],
["DE3163", "Cerise", "Violet"],
["83A697", "Céladon", "Vert"],
["3A020D", "Cassis", "Violet"],
["F4661B", "Carotte", "Orange"],
["FEC3AC", "Carnation (héraldique) ou Carné (botanique)", "Rouge"],
["960018", "Carmin", "Rouge"],
["7E3300", "Caramel", "Brun"],
["FF5E4D", "Capucine", "Rouge"],
["7E5835", "Cannelle", "Brun"],
["785E2F", "Café au lait", "Jaune"],
["462E01", "Café", "Brun"],
["357AB7", "CÃ¦ruléum", "Bleu"],
["2F1B0C", "Cachou", "Brun"],
["614B3A", "Cacao", "Brun"],
["CDCD0D", "Caca d'oie", "Vert"],
["702963", "Byzantium", "Violet"],
["BD33A4", "Byzantin", "Violet"],
["6B5731", "Bureau", "Brun"],
["CD853F", "Brun clair (cheveux)", "Brun"],
["5B3C11", "Brun (cheveux)", "Brun"],
["3F2204", "Brou de noix", "Brun"],
["614E1A", "Bronze", "Orange"],
["842E1B", "Brique", "Rouge"],
["FCDC12", "Bouton d'or", "Jaune"],
["6B0D0D", "Bourgogne", "Rouge"],
["6D071A", "Bordeaux", "Rouge"],
["E2BC74", "Blond (cheveux)", "Jaune"],
["E7A854", "Blond vénitien (cheveux)", "Jaune"],
["25FDE9", "Bleu turquoise", "Bleu"],
["425B8A", "Bleu turquin", "Bleu"],
["0131B4", "Bleu saphir", "Bleu"],
["318CE7", "Bleu roi", "Bleu"],
["0000FF", "Bleu primaire", "Bleu"],
["1D4851", "Bleu pétrole", "Bleu"],
["6600FF", "Bleu Persan", "Violet"],
["067790", "Bleu paon", "Bleu"],
["1B019B", "Bleu outremer", "Bleu"],
["0F056B", "Bleu nuit", "Bleu"],
["03224C", "Bleu marine", "Bleu"],
["6050DC", "Bleu Majorelle", "Bleu"],
["9683EC", "Bleu lavande", "Bleu"],
["002FA7", "Bleu Klein", "Bleu"],
["24445C", "Bleu hussard", "Bleu"],
["56739A", "Bleu guède", "Bleu"],
["80D0D0", "Bleu givré", "Vert"],
["BBD2E1", "Bleu fumée", "Bleu"],
["2C75FF", "Bleu électrique", "Bleu"],
["DFF2FF", "Bleu dragée", "Bleu"],
["00CCCB", "Bleu des mers du sud", "Bleu"],
["24445C", "Bleu de Prusse (pigment)", "Bleu"],
["003366", "Bleu de minuit", "Bleu"],
["318CE7", "Bleu de France", "Bleu"],
["24445C", "Bleu de Berlin", "Bleu"],
["22427C", "Bleu de cobalt (pigment)", "Bleu"],
["77B5FE", "Bleu ciel", "Bleu"],
["8EA2C6", "Bleu charrette", "Bleu"],
["357AB7", "Bleu céruléen", "Bleu"],
["26C4EC", "Bleu céleste", "Bleu"],
["048B9A", "Bleu canard", "Bleu"],
["5472AE", "Bleu barbeau ou bleuet", "Bleu"],
["686F8C", "Bleu ardoise", "Gris"],
["3A8EBA", "Bleu acier", "Bleu"],
["5B3C11", "Blet", "Brun"],
["E8D630", "Blé", "Vert"],
["F4FEFE", "Blanc lunaire", "Bleu"],
["F6FEFE", "Blanc de zinc (pigment)", "Bleu"],
["FEFDF0", "Blanc de Meudon ou de Troyes (pigment)", "Blanc"],
["FBFCFA", "Blanc de lait", "Gris"],
["FEFDF0", "Blanc d'Espagne (pigment)", "Blanc"],
["FEFEFE", "Blanc d'argent (pigment) ou de plomb", "Blanc"],
["FDF1B8", "Blanc crème", "Jaune"],
["FEFEE2", "Blanc cassé", "Jaune"],
["FFFFFF", "Blanc", "Blanc"],
["4E3D28", "Bitume", "Brun"],
["856D4D", "Bistre", "Vert"],
["FFE4C4", "Bisque", "Brun"],
["F1E2BE", "Bis (héraldique)", "Jaune"],
["766F64", "Bis", "Brun"],
["FFF48D", "Beurre frais", "Jaune"],
["F0E36B", "Beurre", "Vert"],
["AFA77B", "Beigeasse (péjoratif)", "Vert"],
["F5F5DC", "Beige clair", "Brun"],
["C8AD7F", "Beige", "Jaune"],
["8B6C42", "Basané (teint)", "Brun"],
["D1B606", "Banane", "Vert"],
["AE642D", "Baillet (chevaux vieilli)", "Orange"],
["A9EAFE", "Azurin", "Bleu"],
["74D0F1", "Azur clair", "Bleu"],
["F0FFFF", "Azur brume", "Bleu"],
["1E7FCB", "Azur (héraldique)", "Bleu"],
["007FFF", "Azur", "Bleu"],
["568203", "Avocat", "Vert"],
["FFCB60", "Aurore", "Jaune"],
["9D3E0C", "Auburn (cheveux)", "Rouge"],
["370028", "Aubergine", "Violet"],
["7BA05B", "Asperge", "Vert"],
["EFEFEF", "Argile", "Blanc"],
["FFFFFF", "Argent (héraldique)1", "Blanc"],
["CECECE", "Argent", "Gris"],
["5A5E6B", "Ardoise", "Bleu"],
["AD4F09", "Aquilain (chevaux)", "Rouge"],
["303030", "Anthracite", "Gris"],
["884DA7", "Améthyste", "Violet"],
["AD390E", "Ambre rouge", "Rouge"],
["F0C300", "Ambre jaune", "Jaune"],
["91283B", "Amarante", "Rouge"],
["82C46C", "Amande", "Vert"],
["A76726", "Alezan (chevaux)", "Jaune"],
["FEFEFE", "Albâtre", "Blanc"],
["000000", "Aile de corbeau (cheveux)", "Noir"],
["79F8F8", "Aigue-marine", "Bleu"],
["88421D", "Acajou", "Brun"],
["7FDD4C", "Absinthe", "Vert"],
["E67E30", "Abricot", "Orange"]
]

}

ntc.init();