"use client"

import React from "react"
import CommentForm from "./comment-form"
import CommentItem from "./comment-item"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { useInfiniteQuery } from "@tanstack/react-query"
import { BsCaretDownFill } from "react-icons/bs"
import { ImSpinner8 } from "react-icons/im"
import { Badge } from "../ui/badge"
import { LuMessageSquare } from "react-icons/lu"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "../ui/button"
import type { IComment } from "@/hooks/useLikeUnlikeMutation"

type CommentsProps = {
  animeId: string
  episodeNumber: string
  anilistId: string
}

export default function Comments({
  animeId,
  episodeNumber,
  anilistId,
}: CommentsProps) {
  const {
    data: comments,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEYS.GET_INFINITE_COMMENTS,
      `${animeId}-episode-${episodeNumber}`,
    ],
    queryFn: ({ pageParam }) =>
      fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/comments/${animeId}-episode-${episodeNumber}?limit=${5}&cursor=${pageParam}`
      ).then((res) => res.json()),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="mt-4">
      <h3 className="flex w-full items-center pt-2.5 text-left text-sm font-semibold md:text-base">
        <div className="mr-2 h-6 w-2 rounded-md bg-primary md:h-8"></div>
        Comments
        <Badge className="ml-2">Beta</Badge>
      </h3>
      <div className="mt-2 w-full rounded-sm bg-destructive px-2 py-5 text-center text-sm md:text-base">
        Respect others. Be nice. No spam. No hate speech.
      </div>

      <div className="my-4 flex items-center gap-2 text-xs md:text-sm">
        <LuMessageSquare />

        <span>Comments EP {episodeNumber}</span>
      </div>
      <div className="mt-2 rounded-lg">
        {isPending ? (
          <div className="relative flex items-center justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          <div>
            <CommentForm
              animeId={animeId}
              episodeNumber={episodeNumber}
              anilistId={anilistId}
            />

            <AnimatePresence>
              {comments?.pages.map((page) =>
                page?.comments.length !== 0 ? (
                  page?.comments.map((comment: IComment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ y: 300, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      className="mb-6 flex w-full gap-3 hover:bg-background/90"
                    >
                      <CommentItem
                        comment={comment}
                        animeId={animeId}
                        episodeNumber={episodeNumber}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-sm">
                    No comments yet. Be the first to comment!
                  </div>
                )
              )}
            </AnimatePresence>

            {hasNextPage && (
              <div>
                {isFetchingNextPage ? (
                  <div>
                    <ImSpinner8 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <Button
                    className="flex items-center gap-1 text-[15px] leading-6 text-primary hover:text-primary/90 active:scale-105"
                    onClick={() => fetchNextPage()}
                    size="sm"
                    variant="ghost"
                  >
                    <BsCaretDownFill className="h-4 w-4" />
                    View More
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
