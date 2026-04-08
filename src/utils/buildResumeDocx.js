import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import { resumeMeta, summary, skillSections, experience, education } from "../content/resumeData";

function link(label, url) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: label, style: "Hyperlink" })],
  });
}

function heading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, allCaps: true })],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun(`• ${text}`)],
  });
}

export async function buildResumeDocxBlob() {
  const m = resumeMeta;
  const children = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: m.fullName, bold: true, size: 44 })],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 140 },
      children: [new TextRun({ text: m.headline, bold: true, size: 24 })],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun(`${m.location}  |  `), link(m.email, `mailto:${m.email}`)],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 140 },
      children: [
        link(m.websiteLabel, m.website),
        new TextRun("  |  "),
        link("GitHub", m.githubUrl),
        new TextRun("  |  "),
        link("LinkedIn", m.linkedinUrl),
      ],
    })
  );

  children.push(heading("Professional Summary"));
  children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun(summary)] }));

  children.push(heading("Technical Skills & Expertise"));
  for (const sec of skillSections) {
    children.push(new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: sec.title, bold: true })] }));
    for (const b of sec.bullets) children.push(bullet(b));
  }

  children.push(heading("Professional Experience"));
  for (const job of experience) {
    children.push(new Paragraph({ spacing: { before: 160, after: 40 }, children: [new TextRun({ text: job.company, bold: true })] }));
    children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `${job.title}  ·  `, bold: true }), new TextRun(job.dates)] }));
    if (job.context) children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun(job.context)] }));
    if (job.highlights) for (const h of job.highlights) children.push(bullet(h));
    if (job.roles) {
      for (const role of job.roles) {
        children.push(new Paragraph({ spacing: { before: 100, after: 40 }, children: [new TextRun({ text: role.summary, bold: true })] }));
        for (const h of role.highlights || []) children.push(bullet(h));
      }
    }
  }

  children.push(heading("Education"));
  for (const e of education) {
    children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: e.degree, bold: true }), new TextRun(` — ${e.school}, ${e.location} (${e.year})`)] }));
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return Packer.toBlob(doc);
}

