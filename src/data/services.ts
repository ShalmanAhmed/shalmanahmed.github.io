export interface Service {
  id: string;
  number: string;
  title: string;
  blurb: string;
}

/** Services exactly as provided. Blurbs stay minimal — nothing invented beyond the given titles. */
export const services: Service[] = [
  {
    id: "front-end-development",
    number: "01",
    title: "Front-End Development",
    blurb: "Interfaces built with care for structure, typography and interaction.",
  },
  {
    id: "web-development",
    number: "02",
    title: "Web Development",
    blurb: "Websites and web platforms assembled end to end.",
  },
  {
    id: "responsive-design",
    number: "03",
    title: "Responsive Design",
    blurb: "Layouts that adapt from small phones to large desktops.",
  },
  {
    id: "ui-based-web-development",
    number: "04",
    title: "UI-Based Web Development",
    blurb: "Development guided by the interface — component by component.",
  },
  {
    id: "web-application-development",
    number: "05",
    title: "Web Application Development",
    blurb: "Application logic, data and flows — not just static pages.",
  },
];
