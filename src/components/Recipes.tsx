import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Calculator, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  available: number;
}

interface Recipe {
  id: string;
  dishName: string;
  ingredients: Ingredient[];
  servings: number;
}

export default function Recipes() {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      dishName: "Grilled Chicken Sandwich",
      ingredients: [
        { id: "1", name: "Chicken Breast", quantity: 150, unit: "g", available: 2000 },
        { id: "2", name: "Bread Slices", quantity: 2, unit: "pieces", available: 20 },
        { id: "3", name: "Lettuce", quantity: 50, unit: "g", available: 500 },
        { id: "4", name: "Tomato", quantity: 1, unit: "pieces", available: 10 }
      ],
      servings: 1
    }
  ]);
  
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: "",
    dishName: "",
    ingredients: [],
    servings: 1
  });
  
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    id: "",
    name: "",
    quantity: 0,
    unit: "",
    available: 0
  });

  const calculatePossibleServings = (recipe: Recipe) => {
    return Math.min(
      ...recipe.ingredients.map(ing => Math.floor(ing.available / ing.quantity))
    );
  };

  const addIngredientToRecipe = () => {
    if (!newIngredient.name || newIngredient.quantity <= 0) return;
    
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, {
        ...newIngredient,
        id: Date.now().toString()
      }]
    }));
    
    setNewIngredient({ id: "", name: "", quantity: 0, unit: "", available: 0 });
  };

  const removeIngredientFromRecipe = (ingredientId: string) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== ingredientId)
    }));
  };

  const saveRecipe = () => {
    if (!newRecipe.dishName || newRecipe.ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add dish name and at least one ingredient",
        variant: "destructive"
      });
      return;
    }

    setRecipes(prev => [...prev, {
      ...newRecipe,
      id: Date.now().toString()
    }]);
    
    setNewRecipe({ id: "", dishName: "", ingredients: [], servings: 1 });
    
    toast({
      title: "Success",
      description: "Recipe added successfully!"
    });
  };

  const updateIngredientQuantity = (recipeId: string, ingredientId: string, usedQuantity: number) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        return {
          ...recipe,
          ingredients: recipe.ingredients.map(ing => 
            ing.id === ingredientId 
              ? { ...ing, available: Math.max(0, ing.available - usedQuantity) }
              : ing
          )
        };
      }
      return recipe;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipe Management</h1>
          <p className="text-muted-foreground">Manage dish recipes and calculate ingredient usage</p>
        </div>
      </div>

      {/* Add New Recipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Recipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dishName">Dish Name</Label>
              <Input
                id="dishName"
                placeholder="Enter dish name"
                value={newRecipe.dishName}
                onChange={(e) => setNewRecipe(prev => ({ ...prev, dishName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={newRecipe.servings}
                onChange={(e) => setNewRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold">Ingredients</Label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
              <Input
                placeholder="Ingredient name"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={newIngredient.quantity || ""}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              />
              <Input
                placeholder="Unit (g, pieces, ml)"
                value={newIngredient.unit}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Available stock"
                value={newIngredient.available || ""}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, available: parseFloat(e.target.value) || 0 }))}
              />
              <Button onClick={addIngredientToRecipe} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {newRecipe.ingredients.length > 0 && (
            <div className="space-y-2">
              <Label>Recipe Ingredients:</Label>
              {newRecipe.ingredients.map((ing) => (
                <div key={ing.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>{ing.name} - {ing.quantity} {ing.unit} (Available: {ing.available})</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredientFromRecipe(ing.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button onClick={saveRecipe} className="w-full">
            Save Recipe
          </Button>
        </CardContent>
      </Card>

      {/* Existing Recipes */}
      <div className="grid gap-6">
        {recipes.map((recipe) => {
          const possibleServings = calculatePossibleServings(recipe);
          return (
            <Card key={recipe.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    <CardTitle>{recipe.dishName}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={possibleServings > 0 ? "default" : "destructive"}>
                      <Calculator className="h-4 w-4 mr-1" />
                      Can make: {possibleServings} servings
                    </Badge>
                  </div>
                </div>
                <CardDescription>Recipe for {recipe.servings} serving(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Required Ingredients:</Label>
                  {recipe.ingredients.map((ing) => (
                    <div key={ing.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <span className="font-medium">{ing.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {ing.quantity} {ing.unit} needed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ing.available >= ing.quantity ? "default" : "destructive"}>
                          Available: {ing.available} {ing.unit}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateIngredientQuantity(recipe.id, ing.id, ing.quantity)}
                          disabled={ing.available < ing.quantity}
                        >
                          Use for 1 serving
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
