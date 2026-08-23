/**
 * Renders one JSON-LD @graph per page.
 *
 * JSON.stringify output is escaped for the `</script>` sequence only — the
 * input is our own build-time data, never user input, so this is belt and
 * braces rather than the primary defence.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
