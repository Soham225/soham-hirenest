import { prisma } from "@/app/utils/db";
import { Require_User } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/general/EmptyState";
import { JobCard } from "@/components/general/JobCard";

// Define the type based on your ACTUAL schema (required fields)
type FavoriteItem = {
  JobPost: {
    id: string;
    jobTitle: string;
    salaryFrom: number; // Required in schema
    salaryTo: number; // Required in schema
    benefits: string[]; // Array in schema
    employmentType: string; // Required in schema
    location: string; // Required in schema
    createdAt: Date;
    Company: {
      name: string; // Required in schema
      location: string; // Required in schema
      logo: string; // Required in schema
      about: string; // Required in schema
    };
  };
};

async function GetFavorites(userId: string): Promise<FavoriteItem[]> {
  const data = await prisma.savedJobPost.findMany({
    where: {
      UserId: userId,
    },
    select: {
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
  const data = await GetFavorites(session.id as string);

  if (data.length === 0) {
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
      {data.map((favorite: FavoriteItem) => (
        <JobCard key={favorite.JobPost.id} job={favorite.JobPost} />
      ))}
    </div>
  );
}
