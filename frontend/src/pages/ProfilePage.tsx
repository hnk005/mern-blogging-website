import AnimationWrapper from "@/shared/animation/AnimationWrapper";
import DataLoader from "@/shared/loader/DataLoader";
import axiosClient from "@/config/axios-customize";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import PageNotFound from "./404Page";
import AboutUser from "@/components/user/AboutUser";
import { useBlogsInfiniteQuery } from "@/hooks/useBlogsInfiniteQuery";
import { useMemo, useState } from "react";
import InpageNaviation from "@/components/home/InpageNaviation";
import HandleFetch from "@/shared/handler/HandleFetch";
import BlogCard from "@/components/blog/BlogCard";
import { IProfile } from "@/types/user.type";
import { callGetProfileUser } from "@/config/axios";

const initStateUserProfile: IProfile = {
  _id: "",
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {
    youtube: "",
    instagram: "",
    facebook: "",
    twitter: "",
    github: "",
    website: "",
  },
  joinedAt: new Date(),
};

const ProfilePage = () => {
  const { id: profileId } = useParams();
  const {
    user: { username },
  } = useAuth();

  const [userBloglimit] = useState(5);

  const {
    data: profile,
    isLoading: isLoadingUserProfile,
    isError: isErrorUserProfile,
  } = useQuery({
    queryKey: ["user/profile", profileId],
    queryFn: async () => {
      if (!profileId) {
        return;
      }
      const response = await callGetProfileUser(profileId);
      return response.data.data;
    },
    retry: false,
  });

  const {
    _id,
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = useMemo(() => profile ?? initStateUserProfile, [profile]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUserBlog,
    isError: isErrorUserBlog,
  } = useBlogsInfiniteQuery(
    {
      tag: "profile",
      limit: userBloglimit,
      author: _id,
    },
    !!_id
  );

  const userBlogs = useMemo(
    () => data?.pages.flatMap((page) => page.result) ?? [],
    [data?.pages]
  );

  if (isErrorUserProfile) {
    return <PageNotFound />;
  }

  return (
    <AnimationWrapper>
      <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
        <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
          {isLoadingUserProfile ? (
            <DataLoader size={35} />
          ) : (
            <>
              <img
                src={profile_img}
                alt=""
                className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
              />
              <h1 className="text-2xl font-medium">@{profile_username}</h1>
              <p className="text-xl capitalize h-6">{fullname}</p>
              <p>
                {total_posts.toLocaleString()} Blogs -
                {total_reads.toLocaleString()} Reads
              </p>
              <div className="flex gap-4 mt-2">
                {profileId == username && (
                  <Link
                    to="/settings/edit/profile"
                    className="btn-light rounded-md"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
              <AboutUser
                className="max-md:hidden"
                bio={bio ?? ""}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </>
          )}
        </div>

        <div className="max-md:mt-12 w-full">
          <InpageNaviation
            routes={["Blog Published", "About"]}
            defaultHidden="About"
          >
            <HandleFetch
              data={userBlogs}
              isError={isErrorUserBlog}
              isLoading={isLoadingUserBlog || !profile}
              messageNoData="No blogs published"
            >
              {userBlogs.map((blog, i: number) => (
                <AnimationWrapper
                  key={i}
                  transition={{ duration: 1, delay: i * 0.1 }}
                >
                  <BlogCard data={blog} />
                </AnimationWrapper>
              ))}
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              )}
            </HandleFetch>

            {isLoadingUserProfile ? (
              <DataLoader size={35} />
            ) : (
              <AboutUser
                bio={bio ?? ""}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            )}
          </InpageNaviation>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default ProfilePage;
