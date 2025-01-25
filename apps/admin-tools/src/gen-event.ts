import { DateTime } from "luxon";

import "dotenv/config";

import { getUFEventsManager } from "@vibefire/managers/userfacing";

export const genEvent = async () => {
  function getRandomItem<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  function getNRandomItems(array: string[], n: number = 4): string[] {
    const randomLength =
      Math.floor(Math.random() * Math.min(n, array.length)) + 1;
    const randomImageIds: string[] = [];

    for (let i = 0; i < randomLength; i++) {
      randomImageIds.push(getRandomItem(array));
    }

    return randomImageIds;
  }

  function getRandomLocation(
    northEastStart: { lat: number; lng: number },
    southWestStart: { lat: number; lng: number },
  ) {
    const lat =
      Math.random() * (northEastStart.lat - southWestStart.lat) +
      southWestStart.lat;
    const lng =
      Math.random() * (northEastStart.lng - southWestStart.lng) +
      southWestStart.lng;
    return { lat, lng };
  }

  function getRandomDate(start: Date, end: Date): Date {
    const d = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
    return DateTime.fromJSDate(d).startOf("hour").toJSDate();
  }

  const titles = [
    "Annual Celebration",
    "Spring Gala",
    "Charity Fundraiser",
    "Community Picnic",
    "Holiday Market",
    "Art Exhibition",
    "Tech Conference",
    "Startup Pitch Night",
    "Music Festival",
    "Film Screening",
    "Book Club Meeting",
    "Poetry Reading",
    "Networking Mixer",
    "Fitness Bootcamp",
    "Cooking Class",
    "Webinar Series",
    "Product Launch",
    "Hackathon",
    "Career Fair",
    "Workshop Session",
  ];
  const descriptions = [
    "Join us for our Annual Celebration, a night of fun, food, and festivities as we look back on a year of achievements.",
    "Welcome the season at our Spring Gala. Enjoy an evening of live music, delicious food, and great company.",
    "Support a good cause at our Charity Fundraiser. Every ticket sold goes towards helping those in need.",
    "Bring your family and friends to our Community Picnic. Enjoy a day of games, food, and outdoor fun.",
    "Get into the holiday spirit at our Holiday Market. Find unique gifts, enjoy holiday treats, and more.",
    "Experience the creativity of local artists at our Art Exhibition. Discover new art and meet the artists behind the work.",
    "Stay ahead of the latest industry trends at our Tech Conference. Hear from leading experts and network with professionals.",
    "Watch as startups take the stage to pitch their innovative ideas at our Startup Pitch Night.",
    "Join us for a day of live music from a lineup of amazing artists at our Music Festival.",
    "Join us for a Film Screening of award-winning films from around the world. Discuss and meet people who love movies as much as you do.",
    "Discuss your favorite books and discover new ones at our Book Club Meeting.",
    "Experience the power of words at our Poetry Reading. Hear from established and emerging poets.",
    "Expand your professional network at our Networking Mixer. Meet industry leaders and like-minded professionals.",
    "Get fit and have fun at our Fitness Bootcamp. All fitness levels are welcome.",
    "Learn new recipes and cooking techniques at our Cooking Class. No experience necessary!",
    "Join our Webinar Series to learn about a variety of topics from the comfort of your own home.",
    "Be the first to see our latest product at our Product Launch. Discover the features and meet the team behind it.",
    "Bring your ideas to life at our Hackathon. Collaborate, create, and solve challenges.",
    "Explore career opportunities at our Career Fair. Meet potential employers and learn about different industries.",
    "Learn new skills and deepen your understanding of a topic at our Workshop Session.",
  ];

  const titlesVariations = [
    "Yearly Grand Celebration",
    "Springtime Gala Extravaganza",
    "Charitable Fundraising Event",
    "Community Gathering Picnic",
    "Festive Holiday Marketplace",
    "Local Artists' Exhibition",
    "Technology and Innovation Conference",
    "Entrepreneurial Startup Pitch Night",
    "Live Music Festival Day",
    "International Film Screening",
    "Literary Book Club Meetup",
    "Poetry Reading and Appreciation",
    "Professional Networking Event",
    "All-levels Fitness Bootcamp",
    "Culinary Cooking Class",
    "Educational Webinar Series",
    "New Product Launch Event",
    "Creative Hackathon Challenge",
    "Career Opportunities Fair",
    "Skill-building Workshop Session",
  ];

  const descriptionsVariations = [
    "Celebrate with us at our Yearly Grand Celebration, a night filled with entertainment, gourmet food, and joyous festivities.",
    "Welcome the spring season at our Gala Extravaganza. Enjoy a night of live performances, exquisite food, and wonderful company.",
    "Join our Charitable Fundraising Event and make a difference. Every ticket contributes to a good cause.",
    "Gather with your family and friends at our Community Picnic. Enjoy a day filled with fun games, tasty food, and outdoor activities.",
    "Get into the festive spirit at our Holiday Marketplace. Discover unique gifts, enjoy seasonal treats, and more.",
    "Appreciate the creativity of local artists at our Art Exhibition. Explore new art pieces and interact with the creators.",
    "Stay updated with the latest industry trends at our Technology and Innovation Conference. Learn from experts and network with professionals.",
    "Witness startups as they present their innovative ideas at our Entrepreneurial Startup Pitch Night.",
    "Spend a day enjoying live performances from a variety of amazing artists at our Music Festival.",
    "Join our International Film Screening event. Watch award-winning films and engage in discussions with fellow movie enthusiasts.",
    "Join our Literary Book Club Meetup. Discuss your favorite books and discover new ones.",
    "Experience the beauty of words at our Poetry Reading and Appreciation event. Listen to established and emerging poets.",
    "Expand your professional network at our Networking Event. Connect with industry leaders and like-minded professionals.",
    "Get fit and have fun at our All-levels Fitness Bootcamp. Everyone is welcome, regardless of fitness level.",
    "Learn new recipes and cooking techniques at our Culinary Cooking Class. No prior experience needed!",
    "Join our Educational Webinar Series to learn about a variety of topics from the comfort of your own home.",
    "Be the first to see our latest product at our New Product Launch Event. Discover its features and meet the team behind it.",
    "Bring your ideas to life at our Creative Hackathon Challenge. Collaborate, create, and solve challenges.",
    "Explore career opportunities at our Career Opportunities Fair. Meet potential employers and learn about different industries.",
    "Learn new skills and deepen your understanding of a topic at our Skill-building Workshop Session.",
  ];

  const imgIds = [
    "ccfeafa3-942e-4b73-b730-5633477a0100",
    "74f5907e-3cac-4309-af60-4d3ff1645600",
    "4426dd64-ad9a-4db2-2219-f50af13cea00",
    "6d84cac3-c4a1-4e2f-a732-93c4ada18900",
    "c661fd46-d0c3-475d-dd38-5e37f0af5000",
    "27b653eb-232a-4e2a-65d0-57045dbe7200",
    "407cdc61-2657-4a16-628a-59e7231e0a00",
    "b574711d-7ee6-4eb3-441b-5d6a02b4f900",
    "44b38884-e281-4a47-20dc-2d74bb5ec900",
    "39dff8bf-bec2-4b7d-4049-ebbfb970d300",
    "14960371-c3bf-4cbd-5a5f-eded4b7f9200",
    "a776b193-8b1a-48f6-9fad-1ee474a00300",
    "fcbadc69-4779-4fc0-33b9-e7820938ae00",
  ];

  const rndTitleDescIndex = Math.floor(Math.random() * descriptions.length);

  const rndTitle = [titles, titlesVariations][Math.round(Math.random())][
    rndTitleDescIndex
  ];
  const rndDesc = [descriptions, descriptionsVariations][
    Math.round(Math.random())
  ][rndTitleDescIndex];

  const northEastStart = {
    lat: 51.599497,
    lng: 0.001639,
  };
  const southWestStart = {
    lat: 51.431566,
    lng: -0.311068,
  };

  const timeStart = getRandomDate(new Date(2025, 0, 1), new Date(2025, 0, 3));
  const timeEnd = getRandomDate(timeStart, new Date(2025, 0, 5));

  const eventId = (
    await getUFEventsManager().createNewEvent({
      userAid: process.env.TEST_USER_AID!,
      accessType: "public",
      name: rndTitle,
      forGroupId: process.env.TEST_GROUP_ID!,
    })
  ).unwrap();

  await getUFEventsManager().updateEvent({
    eventId,
    userAid: process.env.TEST_USER_AID!,
    update: {
      location: {
        addressDescription: "London, UK",
        position: getRandomLocation(northEastStart, southWestStart),
      },
      times: {
        ntzStart: timeStart.toISOString(),
        ntzEnd:
          Math.round(Math.random()) === 1 ? timeEnd.toISOString() : undefined,
      },
      details: [
        { type: "description", value: rndDesc, blockTitle: "Description" },
      ],
      images: {
        bannerImgKeys: getNRandomItems(imgIds, 3),
      },
    },
  });
  await getUFEventsManager().updateEventVisibility({
    eventId,
    userAid: process.env.TEST_USER_AID!,
    update: "publish",
  });

  console.log(`Event "${rndTitle}" created with ID: ${eventId}`);
};
