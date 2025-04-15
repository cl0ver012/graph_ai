const HtmlViewer = ({ htmlContent }: { htmlContent: string }) => {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  return (
    <iframe
      src={url}
      title="HTML Preview"
      className="w-full h-[30rem] border-none"
    />
  );
};

const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-[#1E1E1E] rounded w-1/3" />
    <div className="h-[80vh] bg-[#1E1E1E] rounded" />
  </div>
);

const GenericViewer = ({
  content,
  type,
  loading,
}: {
  content: string | null;
  type: string;
  loading: boolean;
}) => {
  if (loading) return <SkeletonLoader />;

  return (
    <div className="w-full h-full overflow-auto ">
      {type === "html" ? (
        <HtmlViewer htmlContent={content || ""} />
      ) : (
        <pre className="whitespace-pre-wrap">{content}</pre>
      )}
    </div>
  );
};

export default GenericViewer;
