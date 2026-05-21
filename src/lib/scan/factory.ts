import { ScanProvider, ProviderType } from './types';
import { MockProvider } from './providers/mock.provider';

export class ProviderFactory {
  private static providers: Map<ProviderType, ScanProvider> = new Map();

  static getProvider(type: ProviderType): ScanProvider {
    if (this.providers.has(type)) {
      return this.providers.get(type)!;
    }

    let provider: ScanProvider;

    switch (type) {
      case 'mock':
        provider = new MockProvider();
        break;
      case 'binah':
        // return new BinahProvider();
        throw new Error('Binah SDK not implemented');
      case 'faceheart':
        // return new FaceHeartProvider();
        throw new Error('FaceHeart SDK not implemented');
      default:
        provider = new MockProvider();
    }

    this.providers.set(type, provider);
    return provider;
  }
}
