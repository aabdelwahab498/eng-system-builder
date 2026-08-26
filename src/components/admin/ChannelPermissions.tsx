/**
 * Per-entry publishing permissions.
 *
 * Sits next to the visibility toggles (Public site / Portfolio / CV / LinkedIn)
 * and lets the admin decide, channel by channel, where this entry is allowed to
 * be distributed. The "Publish to audience" dialog only offers the enabled ones.
 */

import { useState } from "react";
import {
  POLICY_LABEL,
  draftEntryKey,
  channelPermissions,
  channelsForSurface,
  surfaceFor,
} from "@/lib/distribution/channels";
import { Switch } from "@/components/ui/switch";

type Props = { entryId: string; kind: string; mediaType?: string };

export function ChannelPermissions({ entryId, kind, mediaType }: Props) {
  const surface = surfaceFor(kind, mediaType);
  const storageId = entryId === "new" ? draftEntryKey(kind, mediaType) : entryId;
  const [allowed, setAllowed] = useState<string[] | null>(() =>
    typeof window === "undefined" ? null : channelPermissions.get(storageId),
  );

  if (!surface) return null;
  const channels = channelsForSurface(surface);
  const isOn = (id: string) => (allowed === null ? true : allowed.includes(id));

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Publishing permissions
      </p>
      <div className="space-y-1.5">
        {channels.map((channel) => (
          <div key={channel.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{channel.label}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {POLICY_LABEL[channel.policy]}
              </p>
            </div>
            <Switch
              checked={isOn(channel.id)}
              onCheckedChange={(next) =>
                setAllowed(channelPermissions.set(storageId, channel.id, next, surface))
              }
            />
          </div>
        ))}
      </div>
      {entryId === "new" ? (
        <p className="font-mono text-[10px] text-muted-foreground">
          kept for this draft and applied on save
        </p>
      ) : null}
    </div>
  );
}
