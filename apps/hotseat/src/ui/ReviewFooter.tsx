/** V1 review-build marker (QA-V-041 approved chrome; D-048 wiring). This footer MUST be
 *  removed at the production flip — the release gate requires it gone for public deploy. */
export default function ReviewFooter() {
  return (
    <div className="review-footer" role="note" aria-label="Review build marker">
      V1 REVIEW · REVIEW EDITION — private review build · not for distribution
    </div>
  );
}
