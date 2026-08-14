import { socials } from "@/content/socials";
import config from "./metadata.json" with { type: "json" };

const personId = `${config.site.url}/#person`;
const websiteId = `${config.site.url}/#website`;

const personSchema = {
	"@type": "Person",
	"@id": personId,
	name: "Davidson Rafael",
	url: config.site.url,
	jobTitle: "Web Developer",
	description: config.site.description,
	sameAs: [socials.github, socials.linkedin, socials.kaggle],
};

const webSiteSchema = {
	"@type": "WebSite",
	"@id": websiteId,
	url: config.site.url,
	name: config.site.name,
	description: config.site.description,
	author: { "@id": personId },
	publisher: { "@id": personId },
};

const profilePageSchema = {
	"@type": "ProfilePage",
	"@id": `${config.site.url}/#profilepage`,
	url: config.site.url,
	name: config.site.name,
	isPartOf: { "@id": websiteId },
	about: { "@id": personId },
	mainEntity: { "@id": personId },
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
