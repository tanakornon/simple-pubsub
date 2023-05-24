export class DependencyContainer {
    private static services: Record<string, any> = {};

    static registerService<T>(name: string, service: T): void {
        DependencyContainer.services[name] = service;
    }

    static resolve<T>(name: string): T {
        return DependencyContainer.services[name];
    }
}
