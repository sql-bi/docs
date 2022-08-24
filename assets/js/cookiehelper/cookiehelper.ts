/**!
 * Cookie Helper v2.0
 * Copyright (c) SQLBI. All rigths are reserved.
 * https://www.sqlbi.com/	
*/
interface CookieHelperOptions {

	/** The URL of the privacy page containig information about cookie usage */ 
	privacyUrl: string;

	/** The name of the cookie used to record user consent */
	consentCookie?: string;

	/** A list of cookie names essential to correct working of the website */
	requiredCookies?: string[];

	/** Show cookie bar only to EU users - it need to geo reverse users country */
	onlyEU?: boolean;

	/** URL of checking service */
	euCheckService?: string;

	/** Determine is the cookie bar must be displayed */
	showCookieBar?: boolean;

	/** A message to show in the cookie bar */
	cookieBarMessage?: string;	

	/** A title to show in the cookie bar */
	cookieBarTitle?: string;	

	/** A list of dependencies methods to call after user gives cookie consent */
	dependencies?: Dependencies;
}

type DependencyType = "required"|"optional"|"all";

type Dependencies = {
	[container in DependencyType]: (()=>void)[]
}

interface APIRequest {

	/** Service URL */
	url: string;

	/** Data to pass */
	data: {
		[key: string]: any
	};
}

enum CookieConsent {
	requiredOnly = -1,
	unset = 0,
	all = 1
}

class CookieHelper {
	private options: CookieHelperOptions;

	/**
	 * Are cookies allowed?
	 */ 
	 get cookiesAllowed(): CookieConsent {
		const rawConsent = parseInt(CookieHelper.getCookie(this.options.consentCookie));
		return (isNaN(rawConsent) || rawConsent < CookieConsent.requiredOnly ? 
			CookieConsent.unset : 
			(rawConsent > CookieConsent.all ? 
				CookieConsent.all : 
				rawConsent
			)
		);
	}

	/**
	 * A cookie helper class to collect user cookie consent and provide cookies utils
	 */ 
	constructor(options: CookieHelperOptions) {
		
		// Merge default options with passed ones
		const defaultOptions: CookieHelperOptions = {
			privacyUrl: "",
			consentCookie: "cookie_consent",
			onlyEU: false,
			requiredCookies: [],
			showCookieBar: true,
			cookieBarTitle: "This website uses cookies",
			cookieBarMessage: "We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our analytics partners who may combine it with other information that you have provided to them or that they have collected from your use of their services. You consent to our cookies if you continue to use our website.",
			dependencies: { "all": [], "required": [], "optional": [] }
		};
		this.options = {...defaultOptions, ...options};

		// Check if a cookie bar must be displayed
        const okCookies = this.cookiesAllowed;
        if (okCookies == CookieConsent.unset && this.options.showCookieBar) {
			if (this.options.onlyEU && this.options.euCheckService) {
				this.checkEU();
				
			} else {
				this.showCookieBar();
			}
		} else if (okCookies == CookieConsent.all) {
			this.loadDependencies();
		}
		
		this.updateCookieUI();
		this.listen();
	}

	/**
	 * Add event listeners
	 */ 
	private listen() {

		document.addEventListener("click", e => {
			const target = <HTMLElement>e.target;
			if (target) {
				[".allow-all-cookies", ".allow-necessary-cookies"].forEach(className => {
					let element = <HTMLElement>target.closest(className);
					if (element) {
						if (element.classList.contains("inert")) 
							e.preventDefault();

						this.doConsent(element.classList.contains("allow-all-cookies") ? 
							CookieConsent.all : CookieConsent.requiredOnly
						);
					}
				});
			}
		});

		document.querySelectorAll(".show-cookie-bar").forEach(element => 
			element.addEventListener("click", e => {
				const target = <HTMLElement>e.target;
				if (target.tagName == "A") e.preventDefault();
				this.showCookieBar();
			})
		);
	}

	/**
	 * Assign cookie consent
	 */ 
	doConsent(consent: CookieConsent, temporary = false) {
		if (consent == CookieConsent.unset) {
			CookieHelper.deleteCookie(this.options.consentCookie);
		} else {
			CookieHelper.setCookie(this.options.consentCookie, String(consent), temporary ? 1 : 365);

			this.loadDependencies();
			this.hideCookieBar();

			if (consent == CookieConsent.requiredOnly)
				this.deleteNotRequiredCookies();
		}
		this.updateCookieUI();
	}

	/**
	 * Update UI elements related to cookie consent
	 */ 
	private updateCookieUI() {
		const okCookies = this.cookiesAllowed;
		if (okCookies == CookieConsent.requiredOnly) {
			this.deleteNotRequiredCookies();
			document.querySelectorAll(".cookie-pref").forEach(el => el.innerHTML = "Allow necessary cookies only");

		} else if (okCookies == CookieConsent.all) {
			document.querySelectorAll(".cookie-pref").forEach(el => el.innerHTML = "Allow all cookies (Necessary, Functional, Statistics, Marketing)");
		}

		document.querySelectorAll(".cookie-fallback").forEach((element: HTMLElement) => {
			element.style.display = (okCookies == CookieConsent.all ? "none" : "initial");
		});
	}

	/**
	 * Show cookie bar
	 */ 
    showCookieBar(){
		if (!document.body.classList.contains("has-cookie-bar")) {
			document.body.classList.add("has-cookie-bar");

			const cookieBarHTML =  `
				<div id="cookie-bar">
					<div class="cookies-info">
						<h2>${this.options.cookieBarTitle}</h2>
						<p>${this.options.cookieBarMessage}</p>
						<div class="cookies-ctrl">
							<a href="${this.options.privacyUrl}" rel="nofollow">Cookies Policy</a><br>
							<a href="#" class="allow-necessary-cookies inert">Use necessary cookies only</a>
						</div>
						<a href="#" class="allow-all-cookies button inert">Allow all cookies</a>
					</div>
				</div>
			`;

			document.body.insertAdjacentHTML("afterbegin", cookieBarHTML);
		}
    }
    
	/**
	 * Hide cookie bar
	 */ 
	hideCookieBar(){
		const cookieBarElement = document.querySelector("#cookie-bar");
		if (cookieBarElement) {
			const animation = cookieBarElement.animate([ 
				{ bottom: "-100%" } 
			], {
				duration: 300,
				iterations: 1,
				easing: "ease-in-out",
				fill: "forwards"
			});
			animation.addEventListener("finish", e => {
				document.body.classList.remove("has-cookie-bar");
			});
		} else {
			document.body.classList.remove("has-cookie-bar");
		}
		document.querySelectorAll(".cookie-fallback").forEach(item => item.remove());
	}

	/** 
	 * Execute all dependencies 
	 */
	loadDependencies(){
		const okCookies = this.cookiesAllowed;
		if (okCookies == CookieConsent.all) {
			this.options.dependencies["required"].forEach(method => method());
			this.options.dependencies["all"].forEach(method => method());
			this.options.dependencies["optional"].forEach(method => method());

		} else if (okCookies == CookieConsent.requiredOnly) {
			this.options.dependencies["required"].forEach(method => method());
			this.options.dependencies["all"].forEach(method => method());
		}
	}

	/**
	 * Push a dependency
	 */ 
	addDependency(type: DependencyType, method: ()=>void) {
		this.options.dependencies[type].push(method);

		// Execute method if cookies are allowed
		const okCookies = this.cookiesAllowed;
		if (okCookies == CookieConsent.all || (
			okCookies == CookieConsent.requiredOnly && (type == "required" || type == "all")
		)) method();
	}

	/**
	 * Check user country
	 */ 
	private checkEU() {

		const failed = ()=> {
			this.showCookieBar();
		};

		// Send request
		fetch(this.options.euCheckService, {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "no-cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			//credentials: "omit", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Access-Control-Allow-Origin": "*"
			},
			//redirect: "follow", // manual, *follow, error
			//referrerPolicy: "unsafe-url", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: "action=sqlbi_helpers_coming_from_eu"
		})
            .then(response => response.json())
            .then(data => {
                if (data)
                    this.doConsent(CookieConsent.all, true);
                else
                    failed();
            })
            .catch(ignore => failed());
	}

	/**
	 * Remove all cookies except for consent one
	 */ 
	 deleteAllCookies(){
        let cookies = document.cookie.split(";");
		cookies.forEach(cookie => {
            let name = cookie.split("=")[0];
            if (name != this.options.consentCookie)
                CookieHelper.deleteCookie(name);
        });
    }

	/**
	 * Remove cookies that are not required
	 */ 
	deleteNotRequiredCookies(){
		let cookies = document.cookie.split(";");
		cookies.forEach(cookie => {
            let name = cookie.split("=")[0];
			let canDelete = true;
			for (var i = 0; i < this.options.requiredCookies.length; i++) {
				const requiredCookie = this.options.requiredCookies[i];
            	if (name == this.options.consentCookie || name == requiredCookie || 
					(requiredCookie.substring(requiredCookie.length - 1) == "*" && name.indexOf(requiredCookie.substring(0, requiredCookie.length - 1)) == 0)) {
					canDelete = false;
					break;
				}
			}
			if (canDelete) 
				CookieHelper.deleteCookie(name);
		});
	}


	// Utilities

	/** 
	 * Store a cookie
	 */ 
	 static setCookie(name: string, value: string, days: number) {
        //if (name == this.consentCookieName || days == -1) {
        
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + value + expires + "; path=/; secure";
        //}
        
        return value;
    }

	/**
	 * Retrieve a cookie
	 */ 
    static getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

	/**
	 * Remove a cookie
	 */ 
    static deleteCookie(name: string) {
        CookieHelper.setCookie(name, "", -1);
    }
}