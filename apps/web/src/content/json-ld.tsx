import { education, experiences } from "@/content/experiences";
import { socials } from "@/content/socials";
import { stacksData } from "@/content/stacks";
import config from "./metadata.json" with { type: "json" };

const personId = `${config.site.url}/#person`;
const websiteId = `${config.site.url}/#website`;

const knowsAbout = stacksData.flatMap((category) =>
	category.items.map((item) => item.label),
);

const alumniOf = education.map((entry) => ({
	"@type": "EducationalOrganization",
	name: entry.company,
	...(entry.url ? { url: entry.url } : {}),
}));

const personSchema = {
	"@type": "Person",
	"@id": personId,
	name: config.site.name,
	givenName: config.person.givenName,
	familyName: config.person.familyName,
	url: config.site.url,
	image: config.person.image,
	jobTitle: config.person.jobTitle,
	description: config.site.description,
	email: socials.email.replace("mailto:", ""),
	knowsAbout,
	alumniOf,
	address: {
		"@type": "PostalAddress",
		addressLocality: config.person.locality,
		addressCountry: config.person.countryCode,
	},
	homeLocation: {
		"@type": "Place",
		name: `${config.person.locality}, ${config.person.country}`,
	},
	hasOccupation: experiences.map((entry) => ({
		"@type": "Occupation",
		name: entry.role,
	})),
	sameAs: [socials.github, socials.linkedin, socials.kaggle],
};

const webSiteSchema = {
	"@type": "WebSite",
	"@id": websiteId,
	url: config.site.url,
	name: config.site.name,
	description: config.site.description,
	inLanguage: "en",
	author: { "@id": personId },
	publisher: { "@id": personId },
};

const profilePageSchema = {
	"@type": "ProfilePage",
	"@id": `${config.site.url}/#profilepage`,
	url: config.site.url,
	name: config.site.title,
	description: config.site.description,
	inLanguage: "en",
	isPartOf: { "@id": websiteId },
	about: { "@id": personId },
	mainEntity: { "@id": personId },
	primaryImageOfPage: config.person.image,
};

const schemaGraph = {
	"@context": "https://schema.org",
	"@graph": [personSchema, webSiteSchema, profilePageSchema],
};

function toSafeJson(data: unknown): string {
	return JSON.stringify(data)
		.replace(/&/g, "\\u0026")
		.replace(/</g, "\\u003C")
		.replace(/>/g, "\\u003E")
		.replace(/\//g, "\\u002F");
}

const schemaScript = toSafeJson(schemaGraph);

export function JsonLd() {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: schemaScript }}
		/>
	);
}
