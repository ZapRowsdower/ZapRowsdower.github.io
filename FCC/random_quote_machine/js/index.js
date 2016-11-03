//DATA
var quotes = [
  {
    "author":"John O'Donohue",
    "quote":"It is strange to be here. The mystery never leaves you alone"
  },
  {
    "author":"Edward Abbey",
    "quote":"Why this cult of wilderness? Because we like the taste of freedom; because we like the smell of danger."
  },
  {
    "author":"David Whyte",
    "quote":"You must learn one thing. The world was made to be free in. Give up all the other worlds except the one in which you belong."
  },
  {
    "author":"Alan Watts",
    "quote":"We do not 'come into' this world; we come out of it, as leaves from a tree. As the ocean 'waves,' the universe 'peoples.' Every individual is an expression of the whole realm of nature, a unique action of the total universe."
  },
  {
    "author":"Alan Watts",
    "quote":"But I'll tell you what hermits realize. If you go off into a far, far forest and get very quiet, you'll come to understand that you're connected with everything."
  },
  {
    "author":"David Whyte",
    "quote":"Walking the roads is enough today, I’ll follow the dark line of receding sun."
  },
  {
    "author":"Edward Abbey",
    "quote":"May your trails be crooked, winding, lonesome, dangerous, leading to the most amazing view."
  },
  {
    "author":"Edward Abbey",
    "quote":"A man on foot, on horseback or on a bicycle will see more, feel more, enjoy more in one mile than the motorized tourists can in a hundred miles."
  },
  {
    "author":"Edward Abbey",
    "quote":"The idea of wilderness needs no defense, it only needs defenders."
  },
  {
    "author":"Walt Whitman",
    "quote":"Now I see the secret of the making of the best persons. It is to grow in the open air and, to eat and sleep with the earth."
  },
  {
    "author":"Aldo Leopold",
    "quote":"We abuse the land because we regard it as a commodity belonging to us. When we see land as a community to which we belong, we may begin to use it with love and respect."
  },
  {
    "author":"William O. Douglas",
    "quote":"To be whole and harmonious, man must also know the music of the beaches and the woods. He must find the thing of which he is only an infinitesimal part and nurture it and love it, if he is to live."
  },
  {
    "author":"William O. Douglas",
    "quote":"Man must be able to escape civilization if he is to survive. Some of his greatest needs are for refuges and retreats where he can recapture for a day or a week the primitive conditions of life."
  },
  {
    "author":"Edward Abbey",
    "quote":"There is beauty, heartbreaking beauty, everywhere."
  },
  {
    "author":"David Whyte",
    "quote":"Sometimes it takes a great sky to find that first, bright and indescribable wedge of freedom in your own heart"
  },
  {
    "author":"HORACE KEPHART",
    "quote":"This instinct for a free life in the open is as natural and wholesome as the gratification of hunger and thirst and love. It is Nature’s recall to the simple mode of existence she intended us for."
  },
  {
    "author":"Ezra Pound",
    "quote":"Learn of the green world what can be thy place"
  },
  {
    "author":"John Muir",
    "quote":"Take a course in good water and air; and in the eternal youth of Nature you may renew your own. Go quietly, alone; no harm will befall you."
  },
  {
    "author":"Stewart Udall, Secretary of the Interior 1961—69",
    "quote":"Society as we know it is almost a conspiracy against human health. One of the main forces working to counteract that is the trailsman."
  },
  {
    "author":"Rebecca Solnit",
    "quote":"The fight for free space–for wilderness and for public space–must be accompanied by a fight for free time to spend wandering in that space. Otherwise the individual imagination will be bulldozed over for the chain-store outlets of consumer appetite, true-crime titillations, and celebrity crises."
  },
],
images = [
      "https://scontent-iad3-1.xx.fbcdn.net/t31.0-8/13474940_10207032179978446_7857208768475106145_o.jpg",
      "https://scontent-iad3-1.xx.fbcdn.net/t31.0-8/13443057_10207032179338430_8034999766599052217_o.jpg",
      "https://scontent-iad3-1.xx.fbcdn.net/t31.0-8/13412189_10207032180138450_454572012004838220_o.jpg",
"https://scontent-iad3-1.xx.fbcdn.net/t31.0-8/13433081_10207032179498434_5485070160710204803_o.jpg",
  "https://scontent-iad3-1.xx.fbcdn.net/t31.0-8/13443092_10207032228579661_4147038425955037306_o.jpg"
],
styles = [
  {
    "background-image": "url("+images[0]+")",
    "color":"#333",
    "buttonStyle":{
      "background-color":"rgba(0,124,124,0.5)",
      "color":"#fff"
    }
  },
  {
    "background-image": "url("+images[1]+")",
    "color":"#abc",
    "buttonStyle":{
      "background-color":"rgba(255, 120, 255,0.1)",
      "color":"#efefef"
    }
  },
  {
    "background-image": "url("+images[2]+")",
    "color":"#ccc",
    "buttonStyle":{
      "background-color":"rgba(255, 255, 255,0.1)",
      "color":"#efefef"
    }
  },
  {
    "background-image": "url("+images[3]+")",
    "color":"#ddd",
    "buttonStyle":{
      "background-color":"rgba(255, 255, 255,0.1)",
      "color":"#efefef"
    }
  },
  {
    "background-image": "url("+images[4]+")",
    "color":"#36060F",
    "buttonStyle":{
      "background-color":"rgba(144,124,124,0.5)",
      "color":"#fff"
    }
  }
],
lastQuote = 0,
currStyle = 0,
//UI Elements
quoteText = $(".quote-text"),
quoteAuthor = $(".quote-author"),
btnNextQuote = $("#btnNextQuote");

//METHODS
var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
var getQuote = function (){
  var quoteNum = getRandomInt(0,quotes.length);
  //prevent repeat of last shown quote
  if(quoteNum !== lastQuote) {
    quoteObj = quotes[quoteNum];
    lastQuote = quoteNum;
  } else {
    getQuote();
  }
  return quoteObj;
};
var displayQuote = function () {
  quoteObj = getQuote();
  quoteText.text("\""+quoteObj.quote+"\"");
  quoteAuthor.text("- "+quoteObj.author+" ");
  quoteAuthor.append("<i class='fa fa-twitter fa-lg'></i>");
};
var openTwitter = function () {
  var twitterUrl = "https://twitter.com/intent/tweet?text="+quoteText.text()+" "+quoteAuthor.text()+"&hashtags=quotes&related=freecodecamp";
  window.open(twitterUrl);
};
var changeTheme = function (styles) {
  $("body").css(styles);
  $("#btnNextQuote").css(styles.buttonStyle);
};
var cycleStyle = function () {
  ++currStyle;
  if (currStyle >= styles.length) {
    currStyle = 0;
  }
  changeTheme(styles[currStyle]);
};
//UI BEHAVIOR
$(btnNextQuote).click(function(){displayQuote();});
$(quoteAuthor).click(function(){openTwitter();});
$(document).ready(function () {
  displayQuote();
  changeTheme(styles[0]);
  setInterval(cycleStyle, 15000);
});
$(document).keydown(function (event) {
  if (event.which === 39 || event.which === 37) {
    displayQuote();
  }
});