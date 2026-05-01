export default function LegacyGamePage() {
  return null;
}

export async function getServerSideProps({ params }) {
  return {
    redirect: {
      destination: `/${params.slug}`,
      permanent: true,
    },
  };
}
