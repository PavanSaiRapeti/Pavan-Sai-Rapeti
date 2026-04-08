import { useCallback, useRef } from "react";
import {
  resumeMeta,
  summary,
  skillSections,
  experience,
  education,
} from "../../content/resumeData";
import { buildResumeDocxBlob } from "../../utils/buildResumeDocx";

/** Scoped so copied innerHTML (print / PDF) renders without Tailwind. */
const ATS_RESUME_SCOPED_CSS = `
#ats-resume { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.38; color: #111; }
#ats-resume h1 { font-size: 20pt; font-weight: 800; margin: 0 0 4px 0; letter-spacing: -0.02em; }
#ats-resume .ats-headline { font-size: 11pt; font-weight: 700; margin: 0 0 10px 0; color: #222; }
#ats-resume .ats-meta { font-size: 10pt; margin: 0 0 12px 0; line-height: 1.5; }
#ats-resume .ats-meta p { margin: 2px 0; }
#ats-resume h2 { font-size: 10.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin: 16px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid #333; }
#ats-resume h3 { font-size: 11pt; font-weight: 800; margin: 12px 0 4px 0; }
#ats-resume p { margin: 5px 0; }
#ats-resume ul { margin: 6px 0 10px 0; padding-left: 1.15em; }
#ats-resume li { margin-bottom: 4px; }
#ats-resume a { color: #1e40af; text-decoration: none; border-bottom: 1px solid rgba(30,64,175,0.35); }
#ats-resume a:hover { border-bottom-color: rgba(30,64,175,0.85); }
#ats-resume .ats-job { margin-bottom: 1rem; }
#ats-resume .ats-role { margin-top: 0.65rem; }
#ats-resume .ats-summary { margin-top: 0.25rem; font-size: 11pt; }
#ats-resume .ats-edu-list { list-style: none; padding-left: 0; margin: 8px 0 0 0; }
#ats-resume .ats-edu-list li { margin-bottom: 6px; }
`;

const PRINT_BODY_WRAPPER = `
  body { margin: 0.5in; max-width: 8.5in; background: #fffdf6; }
`;

function ExperienceSection({ job }) {
  return (
    <section className="ats-job mb-4">
      <h3>{job.company}</h3>
      <p className="text-sm font-semibold text-gray-900">
        {job.title}
        <span className="font-normal text-gray-600"> · {job.dates}</span>
      </p>
      {job.context ? <p className="ats-summary text-sm leading-snug text-gray-800">{job.context}</p> : null}
      {job.highlights?.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-snug text-gray-800">
          {job.highlights.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : null}
      {job.roles?.map((role, ri) => (
        <div key={ri} className="ats-role">
          <p className="text-sm font-semibold leading-snug text-gray-900">{role.summary}</p>
          {role.highlights?.length ? (
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-snug text-gray-800">
              {role.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export default function ResumeModal({ title, closeLabel, onClose }) {
  const articleRef = useRef(null);
  const githubUrl = process.env.NEXT_PUBLIC_RESUME_GITHUB_URL || resumeMeta.githubUrl;
  const linkedinUrl = process.env.NEXT_PUBLIC_RESUME_LINKEDIN_URL || resumeMeta.linkedinUrl;

  const downloadDocx = useCallback(async () => {
    const blob = await buildResumeDocxBlob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Pavan_Sai_Rapeti_Resume.docx";
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const savePdfViaPrint = useCallback(() => {
    const node = articleRef.current;
    if (!node || typeof window === "undefined") return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${resumeMeta.fullName} — Resume</title><style>${ATS_RESUME_SCOPED_CSS}${PRINT_BODY_WRAPPER}</style></head><body>`
    );
    w.document.write(node.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }, []);

  const m = resumeMeta;

  return (
    <div className="absolute inset-0 z-30 bg-[#f6f1e6] p-4 md:p-8 print:static print:bg-white print:p-0">
      <div className="flex h-full w-full max-h-full flex-col overflow-hidden rounded-xl bg-[#fffdf6] shadow-xl ring-1 ring-black/5 print:h-auto print:max-h-none print:overflow-visible print:rounded-none print:shadow-none print:ring-0">
        <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white/70 px-4 py-2 backdrop-blur print:hidden">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 hover:bg-gray-50"
              onClick={downloadDocx}
            >
              Download DOCX (ATS)
            </button>
            <button
              type="button"
              className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 hover:bg-gray-50"
              onClick={savePdfViaPrint}
            >
              Download PDF (ATS)
            </button>
            <button
              type="button"
              className="rounded bg-black px-3 py-1 text-sm text-white"
              onClick={onClose}
            >
              {closeLabel}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f6f1e6] print:overflow-visible">
          <article
            ref={articleRef}
            id="ats-resume"
            className="relative mx-auto w-full max-w-[8.5in] bg-[#fffdf6] px-5 py-6 text-black md:my-6 md:rounded-md md:border md:border-slate-200 md:px-10 md:py-10 md:shadow-[0_18px_60px_rgba(15,23,42,0.10)] print:my-0 print:rounded-none print:border-0 print:px-8 print:py-6"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] print:hidden" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)" }} />
            <style dangerouslySetInnerHTML={{ __html: ATS_RESUME_SCOPED_CSS }} />
            <header>
              <h1 className="text-2xl font-bold tracking-tight">{m.fullName}</h1>
              <p className="ats-headline text-sm font-bold">{m.headline}</p>
              <div className="ats-meta text-xs leading-relaxed text-gray-800 sm:text-sm">
                <p>
                  {m.location}
                  {" · "}
                  <a className="text-blue-800 underline" href={`mailto:${m.email}`}>
                    {m.email}
                  </a>
                </p>
                <p>
                  <a className="text-blue-800 underline" href={m.website} target="_blank" rel="noopener noreferrer">
                    {m.websiteLabel}
                  </a>
                  {githubUrl ? (
                    <>
                      {" · "}
                      <a className="text-blue-800 underline" href={githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </>
                  ) : (
                    <span> · GitHub</span>
                  )}
                  {linkedinUrl ? (
                    <>
                      {" · "}
                      <a className="text-blue-800 underline" href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </>
                  ) : (
                    <span> · LinkedIn</span>
                  )}
                </p>
              </div>
            </header>

            <section aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="text-sm font-bold uppercase tracking-wide text-black">
                Professional Summary
              </h2>
              <p className="mt-2 text-sm leading-snug text-gray-900">{summary}</p>
            </section>

            <section className="mt-5" aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="text-sm font-bold uppercase tracking-wide text-black">
                Technical Skills &amp; Expertise
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                {skillSections.map((sec) => (
                  <div key={sec.title}>
                    <h3 className="text-sm font-semibold text-gray-900">{sec.title}</h3>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-snug text-gray-800">
                      {sec.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-5" aria-labelledby="exp-heading">
              <h2 id="exp-heading" className="text-sm font-bold uppercase tracking-wide text-black">
                Professional Experience
              </h2>
              <div className="mt-2">
                {experience.map((job) => (
                  <ExperienceSection key={job.company + job.dates} job={job} />
                ))}
              </div>
            </section>

            <section className="mt-5" aria-labelledby="edu-heading">
              <h2 id="edu-heading" className="text-sm font-bold uppercase tracking-wide text-black">
                Education
              </h2>
              <ul className="ats-edu-list mt-2 list-none space-y-2 text-sm leading-snug text-gray-900">
                {education.map((e, i) => (
                  <li key={i}>
                    <span className="font-semibold">{e.degree}</span>
                    {" — "}
                    {e.school}, {e.location} ({e.year})
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
