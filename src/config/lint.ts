// This is for inputs in forms
import { html, TemplateResult } from "lit-html";

import invalidLogo from "../../assets/svg/invalid_logo.svg";
import { inputFactoryStyles } from "./input-factory-styles";
import { IInput } from "../../model/Input";

export class InputFactory {
  private controller: {
    errors: {};
    showPasswordLogin?: boolean;
    countryImages?: Array<{ name: string; code: string; image: string }>;
  };
  private properties: IInput;

  constructor(
    properties,
    controller?: {
      errors: {};
      showPasswordLogin?: boolean;
      countryImages?: Array<{ name: string; code: string; image: string }>;
    }
  ) {
    this.properties = properties;
    this.controller = controller;
  }

  countryLogoTemplate(): TemplateResult {
    return html`
      <div class="country_logo_container">
        <div class="country_logo">
          ${this.controller.countryImages.map((country) => {
            if (country.name.toLowerCase() === "nigeria") {
              return html`<img src=${country.image} alt="${country.name} logo" width: 26; height:
                17; /> <span>${country.code}</span>`;
            }
          })}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M7 10l5 5 5-5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </div>
    `;
  }

  countriesListTemplate(): TemplateResult {
    return html`
      <div class="countries_list display-none">
        ${this.controller.countryImages.map((country) => {
          return html`<div class="single_country">
            <img src=${country.image} width: 26; height: 17; alt='${country.name} logo'/>
            <span>${country.name}</span>
            <span>${country.code}</span>
          </div>`;
        })}
      </div>
    `;
  }

  render(): TemplateResult {
    const { subType, name, placeholder, aria, lable, required } = this.properties;

    if (name.toLowerCase() === "password") {
      return html`
        ${inputFactoryStyles}
        <div class="form-group">
          <input
            type=${this.controller.showPasswordLogin ? "text" : "password"}
            id=${name}
            class="form-control ${this.controller.errors[name] ? "is-invalid" : ""}"
            name=${name}
            placeholder=${placeholder}
            aria-describedby=${aria || name}
            ?required=${required}
          />
          <span class="password-icon">
            <iron-icon
              id="showPassword"
              icon=${this.controller.showPasswordLogin
                ? "icons:visibility"
                : "icons:visibility-off"}
            ></iron-icon>
          </span>
          <label for=${name} id=${name + "-" + lable}>${lable}</label>
          <div class=${this.controller.errors[name] ? "invalid-feedback" : "display-none"}>
            <div class="feedback-section">
              <span class="feedback-img"><img src=${invalidLogo} alt="" /></span>
              <span class="feedback-text">${this.controller.errors[name]}</span>
            </div>
          </div>
        </div>
      `;
    } else if (name.toLowerCase() === "phone_number") {
      return html`
        ${inputFactoryStyles}
        <div class="form-group">
          <input
            type=${subType || "text"}
            id=${name}
            class="form-control phone_num ${this.controller.errors[name] ? "is-invalid" : ""}"
            name=${name}
            placeholder=${placeholder}
            aria-describedby=${aria || name}
            ?required=${required}
          />
          ${this.countriesListTemplate()} ${this.countryLogoTemplate()}
          <label for=${name} id=${name + "-" + lable}>${lable}</label>
          <div class=${this.controller.errors[name] ? "invalid-feedback" : "display-none"}>
            <div class="feedback-section">
              <span class="feedback-img"><img src=${invalidLogo} alt="" /></span>
              <span class="feedback-text">${this.controller.errors[name]}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      return html`
        ${inputFactoryStyles}
        <div class="form-group">
          <input
            type=${subType || "text"}
            id=${name}
            class="form-control ${this.controller.errors[name] ? "is-invalid" : ""}"
            name=${name}
            placeholder=${placeholder}
            aria-describedby=${aria || name}
            ?required=${required}
          />

          <label for=${name} id=${name + "-" + lable}>${lable}</label>
          <div class=${this.controller.errors[name] ? "invalid-feedback" : "display-none"}>
            <div class="feedback-section">
              <span class="feedback-img"><img src=${invalidLogo} alt="" /></span>
              <span class="feedback-text">${this.controller.errors[name]}</span>
            </div>
          </div>
        </div>
      `;
    }
  }
}
