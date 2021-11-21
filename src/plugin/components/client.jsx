import React, { useMemo, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { BiSend } from "react-icons/all";
import classNames from "classnames";
import AnchorifyText from "react-anchorify-text/lib/components/AnchorifyText";
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import styles from '../styles/style.module.scss'

dayjs.extend(localizedFormat)

const defaultUserImage = 'https://collapp.live/default-user.png'

function Plugin({ useWebsockets, ids, users }) {
  const { loading, state, send } = useWebsockets();
  const [message, setMessage] = useState("")

  const chat = useMemo(() => {
    if (!state?.chat) return []
    const chat = []

    let batch = []
    let currentId = null
    for (const { id, ...rest } of state.chat) {
      if (currentId && currentId !== id) {
        chat.push({
          id: currentId,
          date: batch[0].date,
          messages: batch,
        })
        batch = []
      }
      batch.push(rest)
      currentId = id
    }
    chat.push({
      id: currentId,
      date: batch[0].date,
      messages: batch,
    })

    return chat
  }, [state?.chat])

  if (loading)
    return (
      <div className="w-full h-full text-gray-500 flex flex-col p-8 select-none bg-white">
        <CgSpinner className="animate-spin text-3xl m-auto"/>
      </div>
    )

  const handleSubmit = (e) => {
    e.preventDefault()

    const message_ = message.trim()
    if (!message) return

    send("send_message", { message: message_, id: ids?.user })
    setMessage('')
  }

  return (
    <div className="w-full h-full text-white bg-gray-50 flex flex-col">
      <div className="flex-grow overflow-y-auto flex flex-col-reverse">
        <div className="p-8 space-y-2">
          {chat.map(({ date, id, messages }) => {
            const isCurrent = id === ids?.user
            return (
              <div key={`batch-${date}`} className={classNames("flex items-end", isCurrent && 'flex-row-reverse')}>
                <img alt="User image" src={users[id]?.image ?? defaultUserImage} className={classNames("w-8 h-8 rounded-full", isCurrent ? "ml-2" : "mr-2")} />
                <div className={classNames("space-y-1 flex flex-col mb-2", isCurrent ? "items-end text-right" : "items-start")}>
                  {messages.map(({ message, date }) => (
                    <div
                      key={date}
                      className={classNames(
                        "px-4 py-2 rounded-3xl break-words relative",
                        "after:content-[attr(data-date)] after:block after:whitespace-nowrap after:pointer-events-none after:z-10 after:text-white after:bg-black after:bg-opacity-50 after:backdrop-blur-sm after:-translate-y-full after:-top-1 after:text-xs after:px-2 after:py-1 after:pointer-events-none after:opacity-0 after:rounded-md after:absolute",
                        isCurrent
                          ? "last:rounded-br-lg text-white bg-blueGray-500 after:right-0"
                          : "last:rounded-bl-lg bg-gray-200 text-gray-500 after:left-0",
                        styles.message
                      )}
                      style={{ wordBreak: 'break-word' }}
                      data-date={dayjs(date).format('LLL')}
                    >
                      <AnchorifyText text={message}>
                        <CustomAnchor />
                      </AnchorifyText>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <form className="text-gray-500 border-t-2 flex" onSubmit={handleSubmit}>
        <input className="p-4 pl-6 flex-grow focus:outline-none bg-gray-50" name="message" placeholder="Write your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="text-blue-500 text-2xl pr-6 pl-4 disabled:opacity-50 disabled:pointer-events-none hover:bg-blue-50 transition-all" type="submit" disabled={!message}>
          <BiSend />
        </button>
      </form>
    </div>
  );
}

export default Plugin;

const CustomAnchor = ({ url }) => <a className="underline" href={url} target="_blank">{url}</a>
