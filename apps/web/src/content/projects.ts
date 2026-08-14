import type { Projects } from "@/components/projects-block";
/**
 * 
 *  title: string;
  description: string;
  imageUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  date: Date | string;
  invert:boolean;https://i.pinimg.com/736x/80/0e/de/800ede22b817bb0f0bb23f4fa2190f6c.jpg
 */

export const projectsData: Projects[] = [
	{
		title: "U-Reserve",
		description:
			"University room reservation platform with an interactive floor map, drag-and-drop scheduling, and booking history — built as a campus software engineering group project.",
		imageUrl:
			"https://i.pinimg.com/736x/1a/f9/7b/1af97bbcaba8b8ed28f2ae1137ab9793.jpg",
		repoUrl: "https://github.com/DavidsonRafaelK/U-Reserve",
		liveUrl: "https://u-reserve.vercel.app",
		invert: false,
		date: "Present",
	},
	{
		title: "Church Fundraising Platform",
		description:
			"Monorepo e-commerce platform for church fundraising, built on a Medusa (Next.js + Node.js) commerce boilerplate.",
		imageUrl:
			"https://i.pinimg.com/736x/fe/ac/c4/feacc45b6d0316f11740fc368fcfaf9b.jpg",
		repoUrl: "https://github.com/DavidsonRafaelK/church-fundraising",
		invert: true,
		date: "Present",
	},
	{
		title: "Chef On Pointe",
		description:
			"Custom cake and artisan pastry e-commerce platform — order birthday cakes, wedding cakes, and specialty desserts online.",
		imageUrl:
			"https://i.pinimg.com/736x/11/b0/06/11b00610db776ad67dbe7e75ede0b2f3.jpg",
		repoUrl: "https://github.com/UKRIDA-Developer-Team/chef-on-pointe",
		liveUrl: "https://chef-on-pointe.vercel.app",
		invert: false,
		date: new Date("2026-06-06"),
	},
	{
		title: "MacOS Installation Guide",
		description:
			"Complete MacOS installation guide for Intel and AMD processors on VMware Workstation.",
		imageUrl:
			"https://i.pinimg.com/736x/df/8d/d8/df8dd859bd92cd770839e0c6fa010ab2.jpg",
		repoUrl: "https://github.com/DavidsonRafaelK/MacOS-Installation",
		invert: true,
		date: new Date("2026-03-01"),
	},
];
