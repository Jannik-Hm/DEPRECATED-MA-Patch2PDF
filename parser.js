var filecontent,filename;function readFile(){const d=document.getElementById("testcontent"),[a]=document.querySelector("input[type=file]").files,b=new FileReader;b.addEventListener("load",()=>{"text/csv"===a.type?filecontent=parseCSV(b.result):"text/xml"===a.type&&(filecontent=parseXML(b.result)),filename=a.name},!1),a&&b.readAsText(a)}function parseCSV(b){var d={};return lines=b.replace(/\"/g,"").split("\n"),headers=lines[0].split(";"),layerlistpos=headers.indexOf("Layer"),headers[headers.indexOf("Fix ID")]="FixtureID",headers[headers.indexOf("Ch ID")]="ChannelID",layerindex=1,lines.shift(),lines=lines.filter(function(b){return""!=b}),lines.forEach(function(b){rowelements=b.split(";"),layer=rowelements.splice(layerlistpos,1),temp={},rowelements.forEach(function(b,c){temp[headers[c+1]]=b}),"undefined"==typeof d[layer]&&(d[layer]={},d[layer].index=layerindex++),"undefined"==typeof d[layer].data&&(d[layer].data=[]),d[layer].data.push(temp)}),d}function parseXML(b){var e={};parser=new DOMParser,xmlDoc=parser.parseFromString(b,"text/xml"),layers=xmlDoc.getElementsByTagName("Layer");for(let d of layers){"undefined"==typeof e[d]&&(e[d.attributes.name.value]={},e[d.attributes.name.value].data=[],e[d.attributes.name.value].index=+d.attributes.index.value),fixtures=d.getElementsByTagName("Fixture");for(let b of fixtures)subfixtures=b.getElementsByTagName("SubFixture"),patch=getPatch(subfixtures),null!==patch&&(temp={},temp.FixtureID=returnIfDefined(b.attributes.fixture_id),temp.ChannelID=returnIfDefined(b.attributes.channel_id,"."+(+subfixtures[0].attributes.index.value+1)),temp.Name=returnIfDefined(b.attributes.name),fixtype=b.getElementsByTagName("FixtureType")[0],temp.FixtureType=returnIfDefined(fixtype.attributes.name),temp.Patch=patch,temp.Position=getPosition(subfixtures),temp.Color=subfixtures[0].attributes.color.value,e[d.attributes.name.value].data.push(temp))}return e}function returnIfDefined(b,c=""){return"undefined"==typeof b?null:b.value+c}function getPatch(b){let c;if(1===b.length)c=+b[0].getElementsByTagName("Address")[0].textContent;else{let e=[];for(let c of b)e.push(+c.getElementsByTagName("Address")[0].textContent);c=Math.min(...e)}return 0===c?null:Math.ceil(c/512)+"."+("000"+c%512).slice(-3)}function getMiddle(b){return sum=b.reduce((a,b)=>a+b,0),+(sum/b.length).toFixed(2)}function getPosition(b){let c={};if(1===b.length)abspos=b[0].getElementsByTagName("AbsolutePosition")[0],"undefined"!=typeof abspos&&(abslocation=abspos.getElementsByTagName("Location")[0],c.x=abslocation.attributes.x.value,c.y=abslocation.attributes.y.value,c.z=abslocation.attributes.z.value);else{xarray=[],yarray=[],zarray=[],positions=[];for(let c of b)if(abspos=c.getElementsByTagName("AbsolutePosition")[0],"undefined"!=typeof abspos)absposattr=abspos.getElementsByTagName("Location")[0].attributes,xarray.push(+absposattr.x.value),yarray.push(+absposattr.y.value),zarray.push(+absposattr.z.value);else continue;c.x=getMiddle(xarray),c.y=getMiddle(yarray),c.z=getMiddle(zarray)}return"undefined"==typeof c.x&&(c.x=null),"undefined"==typeof c.y&&(c.y=null),"undefined"==typeof c.z&&(c.z=null),c}