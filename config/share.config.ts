import { creditsConfig } from './credits.config';

export type ShareRewardKey = 'copyLink' | 'publishFuturai' | 'socialShare';

export interface ShareRewardConfigItem {
  credits: number;
  platform: string;
  referencePrefix: string;
}

export const SHARE_REWARD_CONFIG: Record<ShareRewardKey, ShareRewardConfigItem> = {
  copyLink: {
    credits: 0,
    platform: 'copy',
    referencePrefix: 'copy_link',
  },
  publishFuturai: {
    credits: 2,
    platform: 'other',
    referencePrefix: 'publish_futurai',
  },
  socialShare: {
    credits: creditsConfig.rewards.socialShare.creditsPerShare,
    platform: 'other',
    referencePrefix: 'social_share',
  },
};
