var mos = {
	elements: [],
	paths: {
		"user": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAAX3pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja40qtyEzjUgADEwMuE1NzCzNLMzMDIDCxNLE0SgQyLAwgwNDAwNLCwsjACCFmmGiAAkxSzAyB+lO5zMzNjczSgAwAxXsT+bDGzF4AAABgelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeNo9irENgDAMBHtPwQh+x3njcSAEiY6C/YVFwV3zJ71c9zNk+WgubXXz9EO9/AExFH2r2bBb96g2ZHV9CSYnI4wnp6q881sSN7WlVNoAAAAMUExURf//AHcRAP8AAFX/VTuOVW4AAAAlSURBVAjXY2BgYA2FECASQjAGsDowgAHzAeYDEAIrWLUKQiAAAAeEBwnbBasdAAAAAElFTkSuQmCC"
	},
	iofsprefixes: ["iofs:", "#iofs:"],
	langStrings: {
		"en": {
			"Good evening": "Good evening",
			"Good morning": "Good morning",
			"The current time is": "The current time is",
			"The title of the website is": "The title of the website is"
		},
		"de": {
			"Good evening": "Guten Abend",
			"Good morning": "Guten Morgen",
			"The current time is": "Die aktuelle Zeit ist",
			"The title of the website is": "Der Titel der Webseite ist"
		},
		"fr": {
			"Good evening": "Bonsoir",
			"Good morning": "Bonjour",
			"The current time is": "L'heure actuelle est",
			"The title of the website is": "Le titre du site est"
		}
	},
	config: {
		lang: document.documentElement.lang
	},
	}
};

var something = {
	bla: "Good evening"
}
// when document.body changes (event listener)

// mutation observer on document body
var observer = new MutationObserver(function(mutations) {
	onmodified();
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

function onmodified() {
	mos.elements = getMosElements();
	mosElementsHandler()

}

function getMosElements(target = document.body) {
	let tagNameList = ["mos-img", "mos-something", "mos-debug", "mos-time", "mos-lang", "mos-docinfo"];

	var result = [];

	for(tagName of tagNameList) {
		for(element of target.getElementsByTagName(tagName)) {
			result.push(element);
		}
	}
	return result;
}

function mosElementsHandler() {
	for(element of mos.elements) {
		// if(element.classList.contains("__mos-handled") && !element.classList.contains("dynamic")) {
		// 	// already handled
		// 	continue;
		// }
		// element.classList.add("__mos-handled");
		let newElement = getElementValue(element);

		// if content has changed
		if(element.innerHTML != newElement.outerHTML) {
			element.innerHTML = "";
			element.appendChild(newElement);
		}
	}
}

function getElementValue(element) {
	if(element.tagName == "MOS-IMG") {
		result = mos_img(element);
	}

	if(element.tagName == "MOS-DEBUG") {
		result = mos_debug(element);
	}

	if(element.tagName == "MOS-TIME") {
		result = mos_time(element);
	}

	if(element.tagName == "MOS-LANG") {
		result = mos_lang(element);
	}

	if(element.tagName == "MOS-DOCINFO") {
		result = mos_docinfo(element);
	}

	return result;

	function mos_img(element) {
		let newElement = document.createElement("img");
		if(element.getAttribute("src").startsWith("mos-")) {
			newElement.src = handlePath(element.getAttribute("src"));
		} else if (mos.iofsprefixes.includes(element.getAttribute("src").split(":")[0] + ":")) {
		} else {
			newElement.src = handlePath(element.getAttribute("src"));
		}

		if(element.getAttribute("alt")) {
			newElement.alt = element.getAttribute("alt");
		}

		return newElement;
	}

	function mos_debug(element) {
		let type = element.getAttribute("type");
		if(type == "elements") {
			let newElement = document.createElement("div");
			let result = `
			<div style='background-color:gray; display:inline-block'>
				<h3>MOS-DEBUG</h3>
				<table>
					<tbody>
						<tr>
							<th>Tag</th>
						</tr>`;
						for(element of mos.elements) { result += `
						<tr>
							<td>${element.tagName}</td>
						</tr>`;
						}
						result += `
					</tbody>
				</table>
			</div>`;
			newElement.innerHTML = result;
			return newElement;
		} else if(type == "addelement") {
			let newElement = document.createElement("button");
			newElement.innerHTML = "[MOS-DEBUG] Add Element";
			newElement.onclick = function() {
				var newElement = document.createElement("mos-img");
				newElement.setAttribute("src", "mos-user");
				element.parentNode.appendChild(newElement);
			}
			return newElement;
		} else if(type == "head") {
			let newElement = document.createElement("div");
			newElement.style.background = "gray";
			newElement.innerText = document.head.innerHTML;
			return newElement;
	}


	}

	function mos_time(element) {
		let newElement = document.createElement("span");
		let timeResult = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
		newElement.innerHTML = timeResult
		return newElement;
	}

	function mos_lang(element) {
		let newElement = document.createElement("span");
		let text;
		if(element.getAttribute("var")) {
			// text = get variable
			let varName = element.getAttribute("var");
			// if variable exists, else return text
			text = eval(varName);
			console.log(text);
		} else {
			if(!element.getAttribute("text")) {
				element.setAttribute("text", element.innerHTML);
			}
			text = element.getAttribute("text");
		}
		// if string exists, else return text
		if(mos.langStrings[mos.config.lang] && mos.langStrings[mos.config.lang][text]) {
			newElement.innerHTML = mos.langStrings[mos.config.lang][text];
		} else {
			newElement.innerHTML = text;
		}
		return newElement;
	}

	function mos_docinfo(element) {
		if(element.getAttribute("type") == "title") {
			let newElement = document.createElement("span");
			newElement.innerHTML = document.title;
			return newElement;
		}
	}
	

}

function handlePath(path) {
	if(path.startsWith("mos-")) {
		path = path.replace("mos-", "");
		return mos.paths[path];
	} else {
		return path;
	}
}

function handlerImg(element) {
	var img = document.createElement("img");
	img.src = element.getAttribute("src");
	img.alt = element.getAttribute("alt");
	img.style = element.getAttribute("style");
	img.className = element.getAttribute("class");
	element.parentNode.replaceChild(img, element);
}

function returnFile(path, base64 = true) {
	mod_hook("iofs", path);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, false);
	xhr.send(null);
	if(base64) {
		return btoa(xhr.responseText);
	} else {
		return xhr.responseText;
	}
}

function mod_hook(moduleName, path) {
	if(moduleName == "iofs") {
		// TODO

		// TODO: check if iofs is available
		// return iofs.loadfile(path); 
	}
}



onmodified();