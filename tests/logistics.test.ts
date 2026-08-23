import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { venueInfo } from '../src/lib/data/venue';
import { joinLogisticsList } from '../src/lib/utils/logistics';

/**
 * The wording the call for papers was published with. The venue page shows the
 * two lists as lists; the call-for-papers page and the PDF downloads compose
 * this sentence back out of them. If that composition ever stops being exact,
 * an archival page has quietly been rewritten — which is the one thing it may
 * not do, and which nothing else would notice.
 */
const AS_PUBLISHED: Record<'en' | 'fr', string> = {
	en: 'The DFG Programme Point Sud will cover transportation, accommodation, visa costs, catering and local transport for all selected participants. However, vaccinations, health insurance and meals during travel days to and from Stellenbosch cannot be covered.',
	fr: "Le programme DFG Point Sud prendra en charge le transport, l'hébergement, les frais de visa, la restauration et le transport local pour tou·tes les participant·es sélectionné·es. Cependant, les vaccinations, l'assurance maladie et les repas pendant les jours de voyage vers et depuis Stellenbosch ne peuvent pas être couverts."
};

for (const locale of ['en', 'fr'] as const) {
	test(`the ${locale} funding sentence composes back to what the call published`, () => {
		const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
		const composed = [
			messages['logistics_covered_sentence'].replace(
				'{items}',
				joinLogisticsList(venueInfo.logisticsCovered, locale)
			),
			messages['logistics_not_covered_sentence'].replace(
				'{items}',
				joinLogisticsList(venueInfo.logisticsNotCovered, locale)
			)
		].join(' ');
		assert.equal(composed, AS_PUBLISHED[locale]);
	});
}

test('English joins without the Oxford comma the call was published without', () => {
	// Intl.ListFormat('en') would give "catering, and local transport".
	assert.equal(joinLogisticsList({ en: ['a', 'b', 'c'], fr: [] }, 'en'), 'a, b and c');
	assert.equal(joinLogisticsList({ en: [], fr: ['a', 'b', 'c'] }, 'fr'), 'a, b et c');
});

test('both lists carry the same items in both languages', () => {
	// A list that gains an item in one language and not the other would show a
	// participant a different set of costs depending on which site they read.
	assert.equal(venueInfo.logisticsCovered.en.length, venueInfo.logisticsCovered.fr.length);
	assert.equal(venueInfo.logisticsNotCovered.en.length, venueInfo.logisticsNotCovered.fr.length);
});
