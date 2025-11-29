import { prisma } from "@/app/utils/db";
import { Require_User } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/general/EmptyState";
import { JobCard } from "@/components/general/JobCard";

async function GetFavorites(userId: string) {
  const data = await prisma.savedJobPost.findMany({
    where: {
      UserId: userId,
    },
    select: {
      id: true, // include SavedJobPost id
      JobPost: {
        select: {
          id: true,
          jobTitle: true,
          salaryFrom: true,
          salaryTo: true,
          benefits: true,
          employmentType: true,
          location: true,
          createdAt: true,
          Company: {
            select: {
              name: true,
              location: true,
              logo: true,
              about: true,
            },
          },
        },
      },
    },
  });

  return data;
}

export default async function FavoritesPage() {
  const session = await Require_User();
  const favorites = await GetFavorites(session.id as string);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No Favorites Found"
        buttontext="Find a job"
        description="You don't have any favorites yet"
        href="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {favorites.map((fav) => (
        <JobCard key={fav.JobPost.id} job={fav.JobPost} />
      ))}
    </div>
  );
}
