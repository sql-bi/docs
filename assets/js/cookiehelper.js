/*!
 * Cookie Helper 2.1.5
 * Copyright (c) SQLBI. All rigths are reserved.
 * https://www.sqlbi.com/	
*/
class CookieHelper {
	cookieBar;
	allowOnFile;
	explicitConsent;
	prefCookieName;
	necessaryCookies;
	dependencies;
	privacyUrl;
	geoReverseUrl;
	targetEU;

	get cookiesAllowed() {

		if (this.allowOnFile && window.location.protocol == "file:") 
			return "all";

		let ret = this.getCookie(this.prefCookieName) ?? 0;
		if (this.targetEU && ret == 2) //Not EU
			return "all";
		else if (ret == -1)
			return "necessary";
		else if (ret == 1)
			return "all";
		else
			return "notset";
	}
  
	constructor(options) {
		this.explicitConsent = options.explicitConsent ?? true;
		this.prefCookieName = options.prefCookieName ?? "_cookie_consent";
		this.necessaryCookies = options.necessaryCookies ?? [];
		this.dependencies = options.dependencies ?? [];
		this.privacyUrl = options.privacyUrl ?? "";
		this.allowOnFile = options.disableOnFile ?? true;
		this.targetEU = options.targetEU ?? true;
		this.geoReverseUrl = options.geoReverseUrl ?? "";
 
		if (document.readyState == "complete") {
			this.load();
	   	} else {
			window.addEventListener("DOMContentLoaded", () => this.load());
		}
	}

	load() {
		let canSetCookies = this.cookiesAllowed;
		if (canSetCookies == "notset") {
			if (this.targetEU) {
				this.isEuropean()
					.then(yes => {
						if (yes)
							this.showCookieBar();
						else
							this.setCookie(this.prefCookieName, 2, 7);
					});
			} else {
				this.showCookieBar();
			}
		} else if (canSetCookies == "all") {
			this.loadDependencies();
		}

		// Listen privacy links
		this.handlePrivacyLinks();
	}

	handlePrivacyLinks() {

		document.querySelectorAll(".show-cookie-bar").forEach(div => {
			div.addEventListener("click", e => {
				if (e.currentTarget.tagName == "a") 
					e.preventDefault();
				this.showCookieBar();
			});
		});

	}

	isEuropean() {
		const euTime = Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") >= 0;
		if (euTime || !this.geoReverseUrl) {
			return Promise.resolve(true);
		} else {
			const euCountries = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'ES', 'EE', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'SE'];

			const url = this.geoReverseUrl.replace("/{ip}/", "/").replace("{ip}", "");

			return fetch(url, {
				method: "GET", 
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				}
			})
			.then(response => response.json())
			.then(json => !json || !json.country || euCountries.indexOf(json.country) >= 0)
			.catch(ignore => true);
		}
	}

	showCookieBar() {

		if (!this.cookieBar) {
			if (!this.explicitConsent) {
				document.body.addEventListener("click", e => {
					if (this.cookieBar) {
						let dismiss = false;
						if (e.target.classList.contains(".close")) {
							e.preventDefault();
							dismiss = true;
						} else if (!e.target.closest("#cookie-control") && 
								   !e.target.closest("#cookie-bar")) {
							dismiss = true;
						}
						if (dismiss) {
							this.setCookie(this.prefCookieName, 1, 365);
							this.loadDependencies();
							this.hideCookieBar();
						}
					}
				});
			}

			this.addCookieBar();
		}
	}

	hideCookieBar() {
		if (this.cookieBar) {
			this.utils.slideDown(this.cookieBar, 300, ()=>{
				this.cookieBar.remove();
				this.cookieBar = null;
			});
		}
		this.toggleCookieFallback(false);
	}

	toggleCookieFallback(toggle) {
		document.querySelectorAll(".cookie-fallback").forEach(el => {
			el.style.display = (toggle ? "initial" : "none");
		});
	}

	addCookieBar() {

		this.cookieBar = document.createElement("div");
		this.cookieBar.id = "cookie-bar";
		this.cookieBar.style.display = "none";
		this.cookieBar.style.marginTop = 500;
		this.cookieBar.insertAdjacentHTML("beforeend", `
			<div class="cookies-info">
				<h2>This website uses cookies</h2>
				<p>
					We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our analytics partners who may combine it with other information that you have provided to them or that they have collected from your use of their services. You consent to our cookies if you continue to use our website.
				</p>
				<div class="cookies-ctrl">
					<a href="${this.privacyUrl}" rel="nofollow">Cookies Policy</a><br>
					<a href="#" class="allow-necessary-cookies inert">Use necessary cookies only</a>
				</div>
				<a href="#" class="allow-all-cookies button inert">Allow all cookies</a>
			</div>
		`);
		document.body.append(this.cookieBar);

		this.cookieBar.querySelector(".allow-all-cookies").addEventListener("click", e => {
			if (e.currentTarget.classList.contains("inert")) 
				e.preventDefault();

			this.setCookie(this.prefCookieName, 1, 365);
			this.loadDependencies();
			this.hideCookieBar();

			document.querySelectorAll(".cookie-pref").forEach(div => {
				div.innerHTML = "Allow all cookies (Necessary, Functional, Statistics, Marketing)";
			});
		});
		this.cookieBar.querySelector(".allow-necessary-cookies").addEventListener("click", e => {
			if (e.currentTarget.classList.contains("inert")) 
				e.preventDefault();

			this.deleteAllNonNecessaryCookies();
			this.setCookie(this.prefCookieName, -1, 365);
			this.hideCookieBar();

			document.querySelectorAll(".cookie-pref").forEach(div => {
				div.innerHTML = "Allow necessary cookies only";
			});
		});
		this.utils.slideUp(this.cookieBar);
	}

	loadDependencies() {
		this.dependencies.forEach(fn => fn());
	}

	addDependency(fn) {
		this.dependencies.push(fn);
		if (this.cookiesAllowed == "all")
			fn();
	}

	setCookie(name, value, days) {
		let expires = "";
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = `${name}=${value}${expires}; path=/; secure`;
		return value; 
	}

	getCookie(name) {
		let nameEQ = name + "=";
		let ca = document.cookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	deleteCookie(name) {
		this.setCookie(name, "", -1);
	}

	deleteAllCookies() {
		let cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			let name = cookies[i].split("=")[0];
			if (name != this.prefCookieName)
				this.deleteCookie(name);
		}
	}

	deleteAllNonNecessaryCookies() {
		let cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			let name = cookies[i].split("=")[0];
			let canDelete = true;
			for (let ii = 0; ii < this.necessaryCookies.length; ii++) {
				if (name == this.prefCookieName || name == this.necessaryCookies[ii] || (this.necessaryCookies[ii].substr(-1, 1) == "*" && name.indexOf(this.necessaryCookies[ii].substr(0, this.necessaryCookies[ii].length - 1)) == 0)) {
					canDelete = false;
					break;
				}
			}
			if (canDelete) this.deleteCookie(name);
		}
	}
	
	utils = {
		slideDown: (target, duration = 300, callback) => {
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.boxSizing = "border-box";
			target.style.height = target.offsetHeight + "px";
			target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.style.display = "none";
				target.style.removeProperty("height");
				target.style.removeProperty("padding-top");
				target.style.removeProperty("padding-bottom");
				target.style.removeProperty("margin-top");
				target.style.removeProperty("margin-bottom");
				target.style.removeProperty("overflow");
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				if (callback) callback();
			}, duration);
		},
		slideUp: (target, duration = 300, callback) => {
			target.style.removeProperty("display");
			let display = window.getComputedStyle(target).display;

			if (display === "none")
				display = "block";

			target.style.display = display;
			let height = target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.boxSizing = "border-box";
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.height = height + "px";
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			window.setTimeout(() => {
				target.style.removeProperty("height");
				target.style.removeProperty("overflow");
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				if (callback) callback();
			}, duration);
		}
	}
}